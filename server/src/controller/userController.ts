import express, { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { UserInstance } from '../model/userModel'
import bcrypt from 'bcryptjs'
import mailer from '../mailer/SendMail'
import { TransactionEmail } from '../mailer/email_templates/TransactionTemplate';
import { registerUserSchema, generateToken, options } from '../utility/utilis';


const fromUser = process.env.FROM as string

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

            const { email } = User;

            let html = "";
            let fromUser = process.env.FROM as string;
            let subject = "";

            if (template === 'transaction') {
                html = TransactionEmail(transactionDetails)
                subject = "Your transaction details"
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
        throw error
    }
}


export async function createUser(req: Request, res: Response, next: NextFunction) {
    const id = uuidv4();

    // console.log(req.body);

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
