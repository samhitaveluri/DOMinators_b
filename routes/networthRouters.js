import express from 'express';
import {  getNetWorth } from '../controllers/networthControllers.js';
const router = express.Router();
router.get('/get-networth', getNetWorth);
export default router;