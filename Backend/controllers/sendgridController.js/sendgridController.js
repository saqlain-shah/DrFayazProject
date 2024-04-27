import sgMail from '@sendgrid/mail';
import SendgridActivity from '../../models/sendgridActivityModel.js'; // Assuming correct path to your SendgridActivity model

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendConfirmationEmail = async (req, res, next) => {
    try {
        // Assuming appointment data is sent in req.body
        const { to, subject, text, html } = req.body;

        // Construct the email message
        const msg = {
            to,
            from: 'add email', // Replace with your email
            subject,
            text,
            html,
        };

        // Send the email
        await sgMail.send(msg);

        // If you want to log email activity, save it to the database
        const sendgridActivity = new SendgridActivity({
            recipient: to,
            subject,
            // You may add other fields here like timestamp, status, etc.
        });
        await sendgridActivity.save();

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'An error occurred while sending the email' });
    }
};
