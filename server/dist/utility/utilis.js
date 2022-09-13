"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.generateToken = exports.registerUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const generateToken = (user) => {
    const secret = process.env.JWT_SECRET;
    const expires = process.env.JWT_EXPIRES_IN;
    console.log(process.env);
    console.log(jsonwebtoken_1.default.sign(user, secret, { expiresIn: expires }));
    return jsonwebtoken_1.default.sign(user, secret, { expiresIn: expires });
};
exports.generateToken = generateToken;
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};
