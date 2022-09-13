import express, { Request, Response, NextFunction } from 'express';
import { sendEmail, verifyUser } from '../controller/userController';
import { createUser, updateUser } from '../controller/userController';
import { loginUser } from "../controller/userController";

const router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
  return res.status(200).json({ message: 'Welcome to Live POD-A Project', route: '/users' });
});

router.post('/sendmail', sendEmail)
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.post('/login', loginUser);
router.post('/register', createUser);
router.get('/verify/:token', verifyUser);

export default router;
