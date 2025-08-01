import express from 'express';
import { buyAsset, viewAllHoldings, viewHoldingById } from '../controllers/holdingControllers.js';

const router = express.Router();

router.post('/buy', buyAsset);
router.get('/', viewAllHoldings);
router.get('/:id', viewHoldingById);

export default router;