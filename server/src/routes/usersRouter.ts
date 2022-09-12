import express, { Request, Response, NextFunction }  from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.status(200).json({ message: 'Welcome to Live POD-A Project', route: '/users'})
});

export default router
