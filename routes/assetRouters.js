import express from 'express';
import { getAllAssets, getAssetById } from '../controllers/assetController.js';
const router = express.Router();

// router.route('/add')
router.route('/get-all').get(getAllAssets);
router.route('/get/:id').get(getAssetById);

module.exports = router;   