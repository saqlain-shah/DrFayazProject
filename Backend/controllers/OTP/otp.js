// controllers/OTP/otp.js
import fs from 'fs';
import ejs from 'ejs';
import nodemailer from 'nodemailer';

// Map to store generated OTPs
let otpMap = new Map();

// Function to generate OTP
const generateOTP = () => {
    // Generate and return a random 6-digit OTP
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

    // Load email template
    let emailTemplate;
    try {
        emailTemplate = fs.readFileSync('templates/otp_template.ejs', 'utf-8');
    } catch (error) {
        console.error('Error loading email template:', error);
        return res.status(500).json({ success: false, message: "Failed to load email template" });
    }

    // Render email template with OTP data
    const renderedTemplate = ejs.render(emailTemplate, { generatedOTP });

    // Send OTP to the provided email
    try {
        // Create a nodemailer transporter using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'saqlainshahbaltee@gmail.com', // Replace with your Gmail email address
                pass: 'fixewzwfhheqvfgr' // Replace with your Gmail App Password
            }
        });

        // Email content
        const mailOptions = {
            from: 'saqlainshahbaltee@gmail.com', // Replace with your Gmail email address
            to: email,
            subject: 'OTP for Verification',
            html: renderedTemplate
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
    const { otp } = req.body;
    const targetEmail = 'saqlainshahbaltee@gmail.com'; // Assuming email is included in the request user object
    
    // Retrieve the stored OTP for the user
    const storedOTP = otpStore[targetEmail];
  
    // Logic to verify OTP
    try {
      if (otp && storedOTP && otp === storedOTP.toString()) {
        res.status(200).json({ success: true, message: 'OTP verified successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ success: false, message: 'Error verifying OTP' });
    }
  };
