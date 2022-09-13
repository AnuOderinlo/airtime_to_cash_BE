"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controller/userController");
/* GET users listing. */
router.get('/', function (req, res, next) {
    return res.status(200).json({ message: 'Welcome to Live POD-A Project', route: '/users' });
});
router.post('/login', userController_1.loginUser);
exports.default = router;
