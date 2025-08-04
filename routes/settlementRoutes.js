import express from 'express';
import {  viewBalance } from '../controllers/settlementControllers.js';
const router = express.Router();
router.get('/viewBalance', viewBalance);
export default router;