import express from 'express';
import { getPortfolioSummary } from '../controllers/portfolioControllers.js';

const router = express.Router();

router.route('/summary').get(getPortfolioSummary); 

export default router;