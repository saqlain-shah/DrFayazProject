import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'davbabu1122@gmail.com',
        pass: 'ndbpwhkdnajteass'
    }
});

// Export transporter and sendEmail function together
export const sendEmail = (req, res) => {
    const { email, subject, body } = req.body;

    // Create email options
    const mailOptions = {
        from: 'Your Name <your.email@gmail.com>',
        to: 'davbabu1122@gmail.com', // Change this to your recipient email address
        subject: subject,
        text: body // Use the email body received from the client
    };

    // Send email using transporter
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // If there's an error sending the email, send error response
            console.error('Error sending email:', error);
            res.status(500).send({ success: false, error: 'Error sending email' });
        } else {
            // If email sent successfully, send success response
            console.log('Email sent:', info.response);
            res.status(200).send({ success: true, message: 'Email sent successfully' });
        }
    });
};
