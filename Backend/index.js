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
import moment from 'moment-timezone'; 
import Agenda from 'agenda';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Logging the MongoDB URI
console.log('MongoDB URI:', process.env.MONGO_URL);


// Updated function to generate slots in GMT/UTC
// Updated function to generate slots in GMT/UTC
const getSlotsForSpecificPeriod = (startHour, startMinute, endHour, endMinute, duration) => {
    const slots = [];
    const now = moment().utc(); // Use UTC time

    // Generate slots for today
    let startTime = now.clone().set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
    let endTime = now.clone().set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });

    // If endHour is before startHour, adjust endTime to the next day
    if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
        endTime.add(1, 'days');
    }

    while (startTime.isBefore(endTime)) {
        const endSlotTime = startTime.clone().add(duration, 'minutes');
        if (endSlotTime.isAfter(endTime)) break;
        slots.push({
            start: startTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), // Use [Z] for UTC offset
            end: endSlotTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        });
        startTime = endSlotTime;
    }

    // Generate slots for the next day
    startTime = now.clone().add(1, 'days').set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
    endTime = now.clone().add(1, 'days').set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });

    while (startTime.isBefore(endTime)) {
        const endSlotTime = startTime.clone().add(duration, 'minutes');
        if (endSlotTime.isAfter(endTime)) break;
        slots.push({
            start: startTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), // Use [Z] for UTC offset
            end: endSlotTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        });
        startTime = endSlotTime;
    }

    return slots;
};



// Agenda setup
const agenda = new Agenda({ db: { address: process.env.MONGO_URL, collection: 'jobs' } });

// UK Time: 6 PM to 10 PM GMT = 11:00 PM to 3:00 AM PKT
agenda.define('manage slots', async job => {
    console.log('Executing "manage slots" job...');

    const startHour = 18;  // Start hour in GMT (6:00 PM GMT)
    const startMinute = 0; 
    const endHour = 22;   // End hour in GMT (10:00 PM GMT)
    const endMinute = 0;  
    const slotDuration = 20; // Slot duration in minutes

    const slots = getSlotsForSpecificPeriod(startHour, startMinute, endHour, endMinute, slotDuration);

    console.log('Generated Slots:', slots);

    try {
        // Delete past schedules
        const deleteResponse = await axios.delete('https://server-yvzt.onrender.com/api/schedule/past', { 
            data: { now: moment().utc().toDate() } 
        });
        console.log('Past slots deletion response:', deleteResponse.data);
    } catch (error) {
        console.error('Error deleting past slots:', error);
    }

    for (const slot of slots) {
        try {
            const payload = {
                startDateTime: slot.start,
                endDateTime: slot.end
            };
            const response = await axios.post('https://server-yvzt.onrender.com/api/schedule', payload);
            console.log(`Slot created: ${JSON.stringify(response.data)}`);

        } catch (error) {
            console.error('Error managing slot:', error);
        }
    }
});



agenda.on('ready', async () => {
    console.log('Agenda is ready. Scheduling jobs...');
    try {
        await agenda.every('12 20 * * *', 'manage slots');
        await agenda.start();
        console.log('Agenda started and job scheduled.');
    } catch (error) {
        console.error('Error scheduling job with Agenda:', error);
    }
});

agenda.on('error', error => {
    console.error('Agenda error:', error);
});



// MongoDB connection
connectToDatabase().then(() => {
    console.log('Database connection successful');
}).catch(error => {
    console.error('Database connection error:', error);
});

app.use('/uploads', setCors, express.static(path.join(__dirname, 'uploads')));

function setCors(req, res, next) {
    const allowedOrigins = ['https://dashboard.avicenahealthcare.com', 'https://www.avicenahealthcare.com','http://localhost:5173','http://localhost:5174'];
    
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
    origin: ['https://dashboard.avicenahealthcare.com', 'https://www.avicenahealthcare.com','http://localhost:5173','http://localhost:5174'],
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
    if (req.path !== '/api/schedule' && req.path !== '/api/schedule/past') {
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
