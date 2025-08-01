import express from 'express';
import {  viewAllTransactions } from '../controllers/transactionControllers.js';
const router = express.Router();
router.get('/get-all-transactions', viewAllTransactions);
export default router;