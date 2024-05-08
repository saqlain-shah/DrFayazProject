import fs from 'fs';
import nodemailer from 'nodemailer';

// Map to store generated OTPs
global.otpMap = new Map();

// Function to generate OTP
const generateOTP = () => {
    // Generate and return a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP to email
export const sendOTP = async (req, res) => {
    const { email, otpType } = req.body;

    // Check if email and otpType are provided in the request body
    if (!email || !otpType) {
        return res.status(400).json({ success: false, message: "Email and OTP type are required" });
    }

    // Generate OTP
    const generatedOTP = generateOTP();

    // Check if OTP generation failed
    if (!generatedOTP) {
        return res.status(500).json({ success: false, message: "Failed to generate OTP" });
    }

    // Store the OTP temporarily (you can replace this with database storage)
    otpMap.set(`${email}_${otpType}`, generatedOTP); // Use both email and otpType to create a unique key for storing OTP

    // HTML content for OTP email
    const htmlContent = `
    <p>Dear Dentist,</p>
    <p>Your OTP for verification is: <strong>${generatedOTP}</strong></p>
    <p>Please use this OTP to complete your access to the dental chart.</p>
    <p><strong>Warning:</strong> It appears there was an attempt to access your patient records. If this was not initiated by you, please disregard this message. If you suspect unauthorized access, please contact support immediately.</p>
    <p>Thank you!</p>
    `;

    // Send OTP to the provided email
    try {
        // Create a nodemailer transporter using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'saqlainshahbaltee@gmail.com', // Replace with your Gmail email address
                pass: 'qfonuissqspipwtq' // Replace with your Gmail App Password
            }
        });

        // Email content
        const mailOptions = {
            from: 'saqlainshahbaltee@gmail.com', // Replace with your Gmail email address
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