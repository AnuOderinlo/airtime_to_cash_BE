import express, { Request, Response, NextFunction } from 'express';
import { createTransaction, getTransaction, updateTransaction } from '../controller/transactionsController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createTransaction)
router.get('/', auth, getTransaction)
router.patch('/', auth, updateTransaction)

export default router;
