import express, { Request, Response, NextFunction }  from 'express';
import { sendEmail } from '../controller/userController';
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.status(200).json({ message: 'Welcome to Live POD-A Project', route: '/users'})
});

router.post('/sendmail', sendEmail )

export default router
