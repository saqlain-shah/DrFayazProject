import sgMail from '@sendgrid/mail';
import SendgridActivity from '../../models/sendgridActivityModel.js';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendConfirmationEmail = async (req, res, next) => {
    try {
        const { to, subject, text, html } = req.body;
        const msg = {
            to,
            from: 'add email',
            subject,
            text,
            html,
        };
        await sgMail.send(msg);
        const sendgridActivity = new SendgridActivity({
            recipient: to,
            subject,
        });
        await sendgridActivity.save();

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'An error occurred while sending the email' });
    }
};
