import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { createUser } from '../controller/userController';

import {loginUser } from "../controller/userController";

/* GET users listing. */
router.get('/', function (req, res, next) {
  return res.status(200).json({ message: 'Welcome to Live POD-A Project', route: '/users' });
});

router.post('/login', loginUser);

router.post('/register', createUser);

export default router;
