import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import connectToDatabase from './db.js';
import passport from './googleOAuth.js';
import authRoute from './routes/auth.js';
import patientRoute from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalReport.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import otpDashRoutes from './routes/dashOtpRoutes.js';
import healthInformationRoutes from './routes/healthInfoRoutes.js';
import servicesRoute from './routes/services.js';
import sandGridRoutes from './routes/sendgridRoutes.js';
import medicineRoute from './routes/medicineRoutes.js';
import doctorRoutes from './routes/doctor.js';
import userauth from './routes/userauth.js';
import schduleRoutes from './routes/schdule.js';
import webAppointmentRoutes from './routes/webApoint.js';
import emailCampaignRoutes from './routes/emailCampaignRoutes.js';
import { authenticate } from './utils/authMiddleware.js';
import { upload, uploads } from './utils/multerConfig.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import cors from 'cors';
import otpRoutes from './routes/Opt.js';
import stripe from './routes/stripe.js';
import webRoutes from './routes/webRoutes.js';
import EmailSent from './routes/ConfirmEmail.js';
import dentalChartRoutes from './routes/dentalChartRoutes.js';
import cron from 'node-cron';
import moment from 'moment';

const app = express();
app.use(express.json());
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/uploads', setCors, express.static(path.join(__dirname, 'uploads')));

function setCors(req, res, next) {
    const allowedOrigins = ['https://dashboard.avicenahealthcare.com', 'https://www.avicenahealthcare.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}

// Middleware to disable caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

const corsOptions = {
    origin: ['https://dashboard.avicenahealthcare.com', 'https://www.avicenahealthcare.com'],
    credentials: true,
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

// Middleware to authenticate
app.use(authenticate);

// Apply setupMiddleware() only to routes other than /api/schedule
app.use((req, res, next) => {
    if (req.path !== '/api/schedule') {
        authenticate(req, res, next);
    } else {
        next();
    }
});

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
app.use('/api/stripe', stripe);
app.use('/api/', emailCampaignRoutes);
app.use('/api/', EmailSent);
app.use('/api/dental-chart', dentalChartRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Server is running on port ${PORT}`);

    cron.schedule('10 16 * * *', async () => {
        console.log('Task started at:', new Date());
        await manageSlots();
    });
    
    
});

const manageSlots = async () => {
    const startHour = 23; // 11:00 PM
    const endHour = 3; // 3:00 AM next day
    const slotDuration = 30; // Slot duration in minutes

    // Function to get the start and end time for each slot
    const getSlots = (startHour, endHour, duration) => {
        const slots = [];
        let startTime = moment().utcOffset('+05:00').set({ hour: startHour, minute: 0, second: 0, millisecond: 0 });
        let endTime = moment().utcOffset('+05:00').set({ hour: endHour, minute: 0, second: 0, millisecond: 0 });

        if (endHour < startHour) { // If end hour is on the next day
            endTime.add(1, 'day');
        }

        while (startTime.isBefore(endTime)) {
            const endSlotTime = startTime.clone().add(duration, 'minutes');
            if (endSlotTime.isAfter(endTime)) break; // Don't create slots beyond end time
            slots.push({
                start: startTime.format('HH:mm'),
                end: endSlotTime.format('HH:mm')
            });
            startTime = endSlotTime;
        }
        return slots;
    };

    const slots = getSlots(startHour, endHour, slotDuration);
    console.log(`Generated slots: ${JSON.stringify(slots)}`); // Log generated slots

    for (const slot of slots) {
        const startDateTime = moment().utcOffset('+05:00').set({ hour: parseInt(slot.start.split(':')[0]), minute: parseInt(slot.start.split(':')[1]), second: 0, millisecond: 0 }).toISOString();
        const endDateTime = moment().utcOffset('+05:00').set({ hour: parseInt(slot.end.split(':')[0]), minute: parseInt(slot.end.split(':')[1]), second: 0, millisecond: 0 }).toISOString();
        
        const requestData = {
            startDateTime,
            endDateTime
        };

        try {
            const response = await axios.post('https://server-yvzt.onrender.com/api/schedule', requestData);
            console.log(`Slot created: ${JSON.stringify(response.data)}`);
        } catch (error) {
            console.error('Error managing slot:', error);
        }
    }
};



