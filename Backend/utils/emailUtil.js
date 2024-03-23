// utils/emailUtil.js

// Import necessary libraries or modules for sending emails
// For example, you can use nodemailer to send emails
import nodemailer from 'nodemailer';

// Function to generate a random OTP
export const generateOTP = () => {
    // Generate a random number between 100000 and 999999
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send an OTP to the user's email
export const sendEmail = async (email, otp) => {
    try {
        // Create a transporter with your email configuration
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'davbabu1122@gmail.com',
                pass: 'iloveyousajjadhussain'
            }
        });

        // Send the OTP to the user's email
        await transporter.sendMail({
            from: 'davbabu1122@gmail.com',
            to: email,
            subject: 'OTP for Verification',
            text: `Your OTP for verification is: ${otp}`
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

// Function to verify if the entered OTP matches the generated OTP
export const verifyOTP = (enteredOTP, generatedOTP) => {
    return enteredOTP === generatedOTP;
};
