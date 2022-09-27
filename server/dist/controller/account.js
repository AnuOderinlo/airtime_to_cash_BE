"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAccount = exports.deleteBankAccount = exports.getBankAccounts = exports.createAccount = void 0;
const uuid_1 = require("uuid");
const accounts_1 = require("../model/accounts");
async function createAccount(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const userID = req.user.id;
        //  const ValidateAccount = await createAccountSchema.validateAsync(req.body, options);
        //  if (ValidateAccount.error) {
        //         return res.status(400).json({
        //             status: 'error',
        //             message: ValidateAccount.error.details[0].message,
        //         });
        //  } 
        const duplicateAccount = await accounts_1.AccountInstance.findOne({
            where: { accountNumber: req.body.accountNumber },
        });
        if (duplicateAccount) {
            return res.status(409).json({
                msg: "Account number is used, please enter another account number",
            });
        }
        const record = await accounts_1.AccountInstance.create({
            id: id,
            bankName: req.body.bankName,
            accountNumber: req.body.accountNumber,
            accountName: req.body.accountName,
            userId: userID,
            walletBalance: req.body.walletBalance,
        });
        if (record) {
            return res.status(201).json({
                status: 'success',
                message: 'Account created successfully',
                data: record,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}
exports.createAccount = createAccount;
async function getBankAccounts(req, res, next) {
    try {
        console.log('here');
        const userID = req.user.id;
        const account = await accounts_1.AccountInstance.findAll({
            where: { userId: userID },
        });
        if (account) {
            return res.status(200).json({
                status: 'success',
                message: 'Account retrieved successfully',
                data: account,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}
exports.getBankAccounts = getBankAccounts;
async function deleteBankAccount(req, res, next) {
    try {
        const id = req.params.id;
        const account = await accounts_1.AccountInstance.findOne({
            where: { id: id },
        });
        if (account) {
            await account.destroy();
            return res.status(200).json({
                status: 'success',
                message: 'Account deleted successfully',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}
exports.deleteBankAccount = deleteBankAccount;
async function getUserAccount(req, res, next) {
    try {
        const userID = req.user.id;
        const account = await accounts_1.AccountInstance.findOne({
            where: { userId: userID },
        });
        if (account) {
            return res.status(200).json({
                status: 'success',
                message: 'Account retrieved successfully',
                data: account,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    }
}
exports.getUserAccount = getUserAccount;
