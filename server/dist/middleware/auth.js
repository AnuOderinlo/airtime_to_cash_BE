"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const userModel_1 = require("../model/userModel");
const secret = process.env.JWT_SECRET || "secret";
async function auth(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization && !req.cookies.token) {
            return res
                .status(401)
                .json({ message: "Authentication required. Please login" });
        }
        const token = authorization?.slice(7, authorization.length) ||
            req.cookies.token;
        const verified = (0, jsonwebtoken_1.verify)(token, secret);
        if (!verified) {
            return res
                .status(401)
                .json({ message: "Token expired/invalid. Please login" });
        }
        const { id } = verified;
        const usertype = req.cookies.usertype;
        let user;
        switch (usertype) {
            case "user":
                user = await userModel_1.UserInstance.findByPk(id);
                if (!user) {
                    return res
                        .status(401)
                        .json({ message: "User not found. Please login" });
                }
                req.user = user.getDataValue("id");
                break;
            default:
                return res
                    .status(401)
                    .json({ message: "Not authorized. Please login" });
        }
        next();
    }
    catch (err) {
        res.status(401).json({ message: "User not logged in" });
    }
}
exports.auth = auth;
