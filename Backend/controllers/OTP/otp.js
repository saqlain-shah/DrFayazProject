// controllers/OTP/otp.js

// Import nodemailer for sending emails (you need to install it using npm or yarn)
import nodemailer from 'nodemailer';
let otpMap = new Map();

// Function to generate OTP
const generateOTP = () => {
    // Generate and return OTP logic
    // For demonstration, I'm generating a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP to email
export const sendOTP = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided in the request body
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Generate OTP
    const generatedOTP = generateOTP();

    // Check if OTP generation failed
    if (!generatedOTP) {
        return res.status(500).json({ success: false, message: "Failed to generate OTP" });
    }

    // Store the OTP temporarily (you can replace this with database storage)
    otpMap.set(email, generatedOTP);

    // Send OTP to the provided email
    try {
        // Create a nodemailer transporter using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'davbabu1122@gmail.com', // Replace with your Gmail email address
                pass: 'xyzluigclluvrpgt' // Replace with your Gmail password
            }
        });

        // Email content
        const mailOptions = {
            from: 'davbabu1122@gmail.com', // Replace with your Gmail email address
            to: email,
            subject: 'OTP for Verification',
            text: `Your OTP for verification is: ${generatedOTP}`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Return success response
        return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error('Error sending OTP:', error);
        // Remove OTP from temporary storage if sending fails
        otpMap.delete(email);
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    // Check if email and OTP are provided
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Here, implement logic to verify the OTP against the provided email

    try {
        // Your OTP verification logic here
        // If OTP is valid, send success response
        return res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ success: false, message: "An error occurred while verifying OTP" });
    }
};