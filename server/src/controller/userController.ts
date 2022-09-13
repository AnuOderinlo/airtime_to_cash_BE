import express, { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { UserInstance } from '../model/userModel'
import { options, generateToken, loginUserSchema, registerUserSchema } from "../utility/utilis";
import bcrypt from 'bcryptjs'
  
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
          return res.json({message: "Username or email is required"})
        }

        if(!User){
            return res.json({message: "Username or email is required"})
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
