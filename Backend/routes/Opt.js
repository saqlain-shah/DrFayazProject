import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/OTP/otp.js'; // Import sendOTP and verifyOTP functions

const router = express.Router();

router.post('/send-otp-to-doctor', sendOTP);
router.post('/verify-otp', verifyOTP);

export default router;
