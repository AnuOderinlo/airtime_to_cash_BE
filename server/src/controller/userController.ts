import express, { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { UserInstance } from '../model/userModel'
import bcrypt from 'bcryptjs'
import mailer from '../mailer/SendMail'
import jwt from 'jsonwebtoken'


import { TransactionEmail } from '../mailer/email_templates/TransactionTemplate';
import { options, generateToken, loginUserSchema, registerUserSchema, changePasswordSchema } from "../utility/utilis";
import { emailVerificationView } from '../mailer/email_templates/VerificationTemplate'
import { forgotPasswordVerification } from '../mailer/email_templates/ForgotPasswordTemplates'


const fromUser = process.env.FROM as string
const jwtSecret = process.env.JWT_SECRET as string

interface jwtPayload {
  id: string
}

export async function loginUser(req: Request, res: Response) {
  try {

    const { username, email, password } = req.body;

    const validationResult = loginUserSchema.validate(req.body, options)

    if (validationResult.error) {
      return res.status(400).json({ Error: validationResult.error.details[0].message })
    }

    let User;
    if (username) {
      User = await UserInstance.findOne({ where: { username: username } }) as unknown as { [key: string]: string }
    } else if (email) {
      User = await UserInstance.findOne({ where: { email: email } }) as unknown as { [key: string]: string }
    } else {
      return res.json({ message: "Username or email is required" })
    }

    if (!User) {
      return res.json({ message: "Username or email is required" })
    }

    const id = User.id;

    const token = generateToken({ id });

    const validUser = await bcrypt.compare(password, User.password)

    if (!validUser) {
      return res.status(401).json({ message: "Password do not match" })
    }

    return res.status(200).json({ message: "Login successful", token, User })

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'failed to login user',
      route: '/login'
    })
  }
}


export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {

    const token = req.params.token
    const { id } = jwt.verify(token, jwtSecret) as jwtPayload;

    if (!id) {
      res.status(401).json({
        Error: 'Verification failed',
        token
      })
    } else {
      res.status(200).json({
        msg: "Successfully verified new user",
        status: 1,
        id
      });
    }

  } catch (error) {
    res.status(500).json({
      msg: "failed to verify user",
      route: "/verify",
      error: error,
    });
  }
}

export async function sendEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {


    const username = req.body.username;
    const template = req.body.template;
    const transactionDetails = req.body.transactionDetails

    if (username && template) {
      const User = await UserInstance.findOne({
        where: { username: username }
      }) as unknown as { [key: string]: string };

      const { email, id } = User;

      let html = "";
      let fromUser = process.env.FROM as string;
      let subject = "";
      const token = jwt.sign({ id }, jwtSecret, { expiresIn: "30mins" })

      if (template === 'transaction') {
        html = TransactionEmail(transactionDetails)
        subject = "Your transaction details"
      } else if (template === 'verification') {
        html = emailVerificationView(token)
        subject = "Please confirm your email"
      } else {
        res.status(400).json({
          error: "Invalid template type"
        });
      }

      await mailer.sendEmail(
        fromUser,
        email,
        subject,
        html
      )

      res.status(201).json({
        msg: "Successfully sent email",
        status: 1,
        email: email
      });
    } else {
      res.status(400).json({
        error: "Username and template required"
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "failed to send email",
      route: "/sendmail",
      error: error,
    });
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const id = uuidv4();



    try {
      const validationResult = registerUserSchema.validate(req.body, options);
      if (validationResult.error) {
        return res.status(400).json({
          Error: validationResult.error.details[0].message,
        });
      }
      const duplicateEmail = await UserInstance.findOne({
        where: { email: req.body.email },
      });

      const duplicateUsername = await UserInstance.findOne({
        where: { username: req.body.username },
      });

      if (duplicateEmail) {
        return res.status(409).json({
          message: 'Email is used, please change email',
        });
      }

      if (duplicateUsername) {
        return res.status(409).json({
          message: 'Username is used, please change username',
        });
      }

      const duplicatePhone = await UserInstance.findOne({
        where: { phoneNumber: req.body.phoneNumber },
      });

      if (duplicatePhone) {
        return res.status(409).json({
          message: 'Phone number is used',
        });
      }

      const passwordHash = await bcrypt.hash(req.body.password, 8);
      const ConfirmPasswordHash = await bcrypt.hash(req.body.confirm_password, 8);
      const userData = {
        id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: passwordHash,
        confirm_password: ConfirmPasswordHash,
        avatar: req.body.avatar,
        isVerified: req.body.isVerified,
      };

      const userDetails = await UserInstance.create(userData);

      // const id = userDetails?.id;
      const token = generateToken({ id });
      res.status(201).json({
        status: 'Success',
        token,
        message: 'Successfully created a user',
        data: userDetails,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        status: 'Failed',
        Message: 'Unable to create a user',
      });
    }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = (await UserInstance.findOne({
      where: {
        email: email,
      },
    })) as unknown as { [key: string]: string };
    if (!user) {
      return res.status(404).json({
        message: 'email not found',
      });
    }
    const { id } = user;
    const subject = 'Password Reset'
    const token = jwt.sign({ id }, jwtSecret, { expiresIn: '30mins' });
    const html = forgotPasswordVerification(id);
    await mailer.sendEmail(fromUser, req.body.email, subject, html);
    res.status(200).json({
      message: 'Check email for the verification link',
    });
  } catch (error) {
    console.log(error);
  }
}
export async function changePassword(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validationResult = changePasswordSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }
    const user = await UserInstance.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(403).json({
        message: 'user does not exist',
      });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 8);
    await user?.update({
      password: passwordHash,
    });
    return res.status(201).json({
      message: 'Password Successfully Changed',
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
