import express, { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { UserInstance } from '../model/userModel'
import bcrypt from 'bcryptjs'
import mailer from '../mailer/SendMail'
import { TransactionEmail } from '../mailer/email_templates/TransactionTemplate';

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