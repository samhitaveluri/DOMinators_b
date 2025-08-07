import express from 'express';
import { register, login, verifyPin } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-pin', verifyPin);

export default router;