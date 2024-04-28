// Import nodemailer
import nodemailer from 'nodemailer';

// Object to store OTPs for each user
const otpStore = {};

// Method to send OTP to the predefined email address
export const sendOTP = async (req, res) => {
  // Logic to generate and send OTP via email
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'davbabu1122@gmail.com', // Replace with your Gmail address
        pass: 'fbwjeroygujljrie', // Replace with your Gmail password
      },
    });

    // Generate a random OTP (e.g., a 6-digit number)
    const OTP = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    console.log('OTP:', OTP);

    // Store the OTP for the user
    otpStore['davbabu1122@gmail.com'] = OTP;

    // Send OTP email
    const info = await transporter.sendMail({
      from: '"Your App Name" <your_email@gmail.com>', // Sender address
      to: 'davbabu1122@gmail.com', // Send OTP to the predefined email address
      subject: 'OTP Verification', // Subject line
      text: `Your OTP for verification is: ${OTP}`, // Plain text body
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
  const { otp } = req.body;
  const targetEmail = 'davbabu1122@gmail.com'; // Assuming email is included in the request user object
  
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
//       to: 'davbabu1122@gmail.com',
//       from: 'your_email@example.com',
//       subject: 'OTP Verification',
//       text: `Your OTP for verification is: ${OTP}`,
//     });

//     console.log('OTP sent successfully');
//     // Store the OTP for the user
//     otpStore['davbabu1122@gmail.com'] = OTP;

//     res.status(200).json({ success: true, message: 'OTP sent successfully' });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ success: false, message: 'Failed to send OTP' });
//   }
// };

// // Method to verify the provided OTP
// export const verifyOTP = async (req, res) => {
//   const { otp } = req.body;
//   const targetEmail = 'davbabu1122@gmail.com'; // Assuming email is included in the request user object

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
// };








