import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { createUser } from '../controller/userController';

/* GET users listing. */
router.get('/', function (req, res, next) {
  return res.status(200).json({ message: 'Welcome to Live POD-A Project', route: '/users' });
});

router.post('/users', createUser);

export default router;
