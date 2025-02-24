import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/OTP/otp.js';

const router = express.Router();

router.post('/send-otp-to-doctor', sendOTP);
router.post('/verify-otp', verifyOTP);

export default router;
