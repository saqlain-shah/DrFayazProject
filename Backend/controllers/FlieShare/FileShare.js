// controllers/fileController.js


import nodemailer from 'nodemailer';
import twilio from 'twilio';

const sendEmail = async (emailAddress, filePath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_password'
    }
  });

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: emailAddress,
    subject: 'File Shared via Email',
    text: 'Please find attached file.',
    attachments: [
      { path: filePath }
    ]
  };

  await transporter.sendMail(mailOptions);
};
const sendWhatsAppMessage = async (phoneNumber, filePath) => {
  const twilioClient = twilio('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');

  await twilioClient.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${phoneNumber}`,
    body: 'File Shared via WhatsApp',
    mediaUrl: `http://yourserver.com/${filePath}`
  });
};
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    res.status(200).json({ message: 'File uploaded successfully', filePath: filePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'An error occurred while uploading file' });
  }
};
export const shareViaEmail = async (req, res) => {
  try {
    const { emailAddress, filePath } = req.body;

    if (!emailAddress || !filePath) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    await sendEmail(emailAddress, filePath);
    res.status(200).json({ message: 'File shared via email successfully' });
  } catch (error) {
    console.error('Error sharing file via email:', error);
    res.status(500).json({ error: 'An error occurred while sharing file via email' });
  }
};
export const shareViaWhatsApp = async (req, res) => {
  try {
    const { phoneNumber, filePath } = req.body;

    if (!phoneNumber || !filePath) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    await sendWhatsAppMessage(phoneNumber, filePath);
    res.status(200).json({ message: 'File shared via WhatsApp successfully' });
  } catch (error) {
    console.error('Error sharing file via WhatsApp:', error);
    res.status(500).json({ error: 'An error occurred while sharing file via WhatsApp' });
  }
};

