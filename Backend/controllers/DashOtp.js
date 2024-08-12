import nodemailer from 'nodemailer';

// Object to store OTPs for each user
const otpStore = {};

// Method to send OTP to the provided email address
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body; // Extract email from request body

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        // user: 'appointment@avicenahealthcare.com', // Replace with your email address
        user: 'appointment@avicenahealthcare.com', 
        pass: 'Godaay2024' // Replace with your password
      }
    });

    // Generate a random OTP (e.g., a 6-digit number)
    const OTP = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    console.log('OTP:', OTP);

    // Store the OTP for the user
    otpStore[email] = OTP.toString(); // Store OTP with the email provided in the request body

    // Send OTP email
    const info = await transporter.sendMail({
      // from: 'appointment@avicenahealthcare.com', // Sender address
      from: 'appointment@avicenahealthcare.com',
      to: email, // Send OTP to the provided email address
      subject: 'OTP Verification', // Subject line
      html: `
      <p>Dear Fayaz,</p>
      <p>Your OTP for verification is: <strong>${OTP}</strong></p>
      <p>Please use this OTP to complete your verification process.</p>
      <p><strong>Warning:</strong> It seems there was an attempt to access your dashboard. If this was not you, please disregard this message. If you suspect unauthorized access, please contact support immediately.</p>
      <p>Thank you!</p>
    ` // HTML body
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Method to verify the provided OTP
export const verifyOTP = async (req, res) => {
  const { otp, email } = req.body; // Extract email and OTP from request body

  // Retrieve the stored OTP for the user
  const storedOTP = otpStore[email]; // Retrieve stored OTP using the provided email

  // Logic to verify OTP
  try {
    if (otp && storedOTP && otp.trim() === storedOTP.trim()) {
      // Remove the OTP from the store after successful verification
      delete otpStore[email];
      res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
};




// import sgMail from '@sendgrid/mail';

// // Set your SendGrid API key
// sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

// // Object to store OTPs for each user
// const otpStore = {};

// // Method to send OTP to the predefined email address
// export const sendOTP = async (req, res) => {
//   try {
//     // Generate a random OTP (e.g., a 6-digit number)
//     const OTP = Math.floor(100000 + Math.random() * 900000);
//     console.log('OTP:', OTP);

//     // Send OTP email using SendGrid
//     await sgMail.send({
//       to: 'appointment@avicenahealthcare.com',
//       from: 'your_email@example.com',
//       subject: 'OTP Verification',
//       text: `Your OTP for verification is: ${OTP}`,
//     });

//     console.log('OTP sent successfully');
//     // Store the OTP for the user
//     otpStore['appointment@avicenahealthcare.com'] = OTP;

//     res.status(200).json({ success: true, message: 'OTP sent successfully' });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ success: false, message: 'Failed to send OTP' });
//   }
// };

// // Method to verify the provided OTP
// export const verifyOTP = async (req, res) => {
//   const { otp } = req.body;
//   const targetEmail = 'appointment@avicenahealthcare.com'; // Assuming email is included in the request user object

//   // Retrieve the stored OTP for the user
//   const storedOTP = otpStore[targetEmail];

//   try {
//     if (otp && storedOTP && otp === storedOTP.toString()) {
//       res.status(200).json({ success: true, message: 'OTP verified successfully' });
//     } else {
//       res.status(400).json({ success: false, message: 'Invalid OTP' });
//     }
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     res.status(500).json({ success: false, message: 'Error verifying OTP' });
//   }