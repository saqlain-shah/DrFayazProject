import fs from 'fs';
import nodemailer from 'nodemailer';

global.otpMap = new Map();
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
    otpMap.set(`${email}_${otpType}`, generatedOTP);
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
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'appointment@avicenahealthcare.com', // Replace with your email address
              pass: 'Godaay2024' // Replace with your email password
            }
          });
        const mailOptions = {
            from: 'appointment@avicenahealthcare.com', // Replace with your email address
            to: email,
            subject: 'OTP for Verification',
            html: htmlContent
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Return success response
        return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error('Error sending OTP:', error);
        // Remove OTP from temporary storage if sending fails
        otpMap.delete(`${email}_${otpType}`); // Remove the OTP from the map if sending fails
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp, otpType } = req.body; // Get otpType from the request body

    // Check if email, OTP, and otpType are provided
    if (!email || !otp || !otpType) {
        return res.status(400).json({ success: false, message: "Email, OTP, and OTP type are required" });
    }

    // Retrieve the stored OTP for the email and otpType
    const storedOTP = otpMap.get(`${email}_${otpType}`);

    // Check if storedOTP exists
    if (!storedOTP) {
        return res.status(400).json({ success: false, message: "No OTP found for the provided email and OTP type" });
    }

    // Convert storedOTP and user OTP to strings
    const storedOTPString = storedOTP.toString();
    const userOTPString = otp.toString();

    // Check if OTP is valid
    if (storedOTPString === userOTPString) {
        // OTP is valid, remove it from the map
        otpMap.delete(`${email}_${otpType}`);
        // Your OTP verification logic here
        // If OTP is valid, send success response
        return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      // Invalid OTP
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  };