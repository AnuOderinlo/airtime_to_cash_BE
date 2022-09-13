"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.registerUserSchema = exports.generateToken = exports.loginUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.loginUserSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase(),
    username: joi_1.default.string().trim().lowercase(),
    password: joi_1.default.string().required()
});
const generateToken = (user) => {
    const passPhrase = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(user, passPhrase, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
exports.registerUserSchema = joi_1.default.object()
    .keys({
    firstname: joi_1.default.string().trim().required(),
    lastname: joi_1.default.string().trim().required(),
    username: joi_1.default.string().trim().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    phoneNumber: joi_1.default.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    password: joi_1.default.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    avatar: joi_1.default.string(),
    isVerified: joi_1.default.boolean(),
    confirm_password: joi_1.default.ref('password'),
})
    .with('password', 'confirm_password');
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
