"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const userModel_1 = require("../model/userModel");
const utilis_1 = require("../utility/utilis");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;
        const validationResult = utilis_1.loginUserSchema.validate(req.body, utilis_1.options);
        if (validationResult.error) {
            return res.status(400).json({ Error: validationResult.error.details[0].message });
        }
        let User;
        if (username) {
            User = await userModel_1.UserInstance.findOne({ where: { username: username } });
        }
        else if (email) {
            User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        }
        else {
            return res.json({ message: "Username or email is required" });
        }
        const id = User.id;
        const token = (0, utilis_1.generateToken)({ id });
        const validUser = await bcryptjs_1.default.compare(password, User.password);
        if (!validUser) {
            return res.status(401).json({ message: "Password do not match" });
        }
        return res.status(200).json({ message: "Login successful", token, User });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'failed to login user',
            route: '/login'
        });
    }
}
exports.loginUser = loginUser;
