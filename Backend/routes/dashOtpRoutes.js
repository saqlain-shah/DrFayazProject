// routes/otpRoutes.mjs

import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/DashOtp.js';

const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendOTP);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 1e73cdba4b9b6a782d752c5fbc535447a2b75918
