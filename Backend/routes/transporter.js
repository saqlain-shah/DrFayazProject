import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'davbabu1122@gmail.com',
        pass: 'ndbpwhkdnajteass'
    }
});


