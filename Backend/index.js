import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './db.js';
import setupMiddleware from './middleware.js';
import passport from './googleOAuth.js';
import authRoute from './routes/auth.js';
import patientRoute from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalReport.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import otpDashRoutes from './routes/dashOtpRoutes.js'
import healthInformationRoutes from './routes/healthInfoRoutes.js';
import servicesRoute from './routes/services.js';
import sandGridRoutes from './routes/sendgridRoutes.js'
import medicineRoute from './routes/medicineRoutes.js'
import doctorRoutes from './routes/doctor.js'
import userauth from './routes/userauth.js'
import schduleRoutes from './routes/schdule.js'
import webAppointmentRoutes from './routes/webApoint.js'
import emailCampaignRoutes from './routes/emailCampaignRoutes.js'
import { authenticate } from './utils/authMiddleware.js';
import { upload, uploads } from './utils/multerConfig.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import cors from 'cors';
import otpRoutes from './routes/Opt.js';
import stripe from './routes/stripe.js';
import webRoutes from './routes/webRoutes.js'
import EmailSent from './routes/ConfirmEmail.js'




const app = express();
app.use(express.json());
dotenv.config();
setupMiddleware();



const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Middleware to disable caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});




const corsOptions = {
    origin: ['http://localhost:5174', 'http://localhost:5173', ],
    credentials: true, // You may need to include this if your requests include credentials (e.g., cookies)
};

app.use(cors(corsOptions));




// Handling file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    res.json({ imageUrl: '/uploads/' + file.filename });
});


app.use('/api/medical-records', uploads, medicalRecordRoutes);

// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('https://www.avicenahealthcare.com');
});




app.use(authenticate);
app.use('/api/auth', authRoute);
app.use('/api/userauth', userauth);
app.use('/api/patients', patientRoute);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/web', webRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/health-information', healthInformationRoutes);
app.use('/api/services', servicesRoute);
app.use('/api/schedule', schduleRoutes);
app.use('/api/sandgrid', sandGridRoutes);
app.use('/api/medicine', medicineRoute);
app.use('/api/v1', webAppointmentRoutes);
app.use('/api/otps', otpDashRoutes);

app.use('/api/otp', otpRoutes);
app.use('/api/otps', otpDashRoutes);

app.use('/api/stripe', stripe);
app.use('/api/', emailCampaignRoutes)
app.use('/api/',EmailSent)



const PORT = process.env.PORT || 8800;
app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
});