import express from 'express';
import { buyAsset, viewAllHoldings, viewHoldingById , sellHolding} from '../controllers/holdingControllers.js';

const router = express.Router();

router.post('/buy', buyAsset);
router.get('/', viewAllHoldings);
router.get('/:id', viewHoldingById);
router.post('/sell', sellHolding);
export default router;