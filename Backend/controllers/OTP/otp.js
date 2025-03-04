import fs from 'fs';
import nodemailer from 'nodemailer';

global.otpMap = new Map();
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (req, res) => {
    const { email, otpType } = req.body;
    if (!email || !otpType) {
        return res.status(400).json({ success: false, message: "Email and OTP type are required" });
    }

    const generatedOTP = generateOTP();
    if (!generatedOTP) {
        return res.status(500).json({ success: false, message: "Failed to generate OTP" });
    }

    const expiryTime = Date.now() + OTP_EXPIRATION_TIME;
    otpMap.set(`${email}_${otpType}`, { otp: generatedOTP, expiry: expiryTime });

    const htmlContent = `
    <p>Dear Doctor,</p>
    <p>Your OTP for verification is: <strong>${generatedOTP}</strong></p>
    <p>Please use this OTP to complete your access to the dental chart.</p>
    <p><strong>Warning:</strong> It appears there was an attempt to access your patient records. If this was not initiated by you, please disregard this message. If you suspect unauthorized access, please contact support immediately.</p>
    <p>Thank you!</p>
    `;

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: 'appointment@avicenahealthcare.com',
                pass: 'Godaay2024'
            }
        });

        const mailOptions = {
            from: 'appointment@avicenahealthcare.com',
            to: email,
            subject: 'OTP for Verification',
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error('Error sending OTP:', error);
        otpMap.delete(`${email}_${otpType}`);
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp, otpType } = req.body;
    if (!email || !otp || !otpType) {
        return res.status(400).json({ success: false, message: "Email, OTP, and OTP type are required" });
    }

    const storedData = otpMap.get(`${email}_${otpType}`);
    if (!storedData) {
        return res.status(400).json({ success: false, message: "No OTP found for the provided email and OTP type" });
    }

    const { otp: storedOTP, expiry } = storedData;

    if (Date.now() > expiry) {
        otpMap.delete(`${email}_${otpType}`);
        return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    if (storedOTP.toString() === otp.toString()) {
        otpMap.delete(`${email}_${otpType}`);
        return res.json({ success: true, message: "OTP verified successfully" });
    } else {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
};
