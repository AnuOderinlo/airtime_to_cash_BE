"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const userModel_1 = require("../model/userModel");
const SendMail_1 = __importDefault(require("../mailer/SendMail"));
const TransactionTemplate_1 = require("../mailer/email_templates/TransactionTemplate");
const fromUser = process.env.FROM;
async function sendEmail(req, res, next) {
    try {
        const username = req.body.username;
        const template = req.body.template;
        const transactionDetails = req.body.transactionDetails;
        if (username && template) {
            const User = await userModel_1.UserInstance.findOne({
                where: { username: username }
            });
            const { email } = User;
            let html = "";
            let fromUser = process.env.FROM;
            let subject = "";
            if (template === 'transaction') {
                html = (0, TransactionTemplate_1.TransactionEmail)(transactionDetails);
                subject = "Your transaction details";
            }
            else {
                res.status(400).json({
                    error: "Invalid template type"
                });
            }
            await SendMail_1.default.sendEmail(fromUser, email, subject, html);
            res.status(201).json({
                msg: "Successfully sent email",
                status: 1,
                email: email
            });
        }
        else {
            res.status(400).json({
                error: "Username and template required"
            });
        }
    }
    catch (error) {
        throw error;
    }
}
exports.sendEmail = sendEmail;
