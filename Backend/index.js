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
dotenv.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('MongoDB URI:', process.env.MONGO_URL);

const getSlotsForSpecificPeriod = (timeRanges, duration) => {
    console.log('getSlotsForSpecificPeriod is running...');
    const slots = [];
    const now = moment().utc();
    const today = now.clone().startOf('day');
    const tomorrow = today.clone().add(1, 'day');
    
    for (const { startHour, startMinute, endHour, endMinute } of timeRanges) {
        let startTime = today.clone().set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
        let endTime = today.clone().set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });

        while (startTime.isBefore(endTime)) {
            const endSlotTime = startTime.clone().add(duration, 'minutes');
            if (endSlotTime.isAfter(endTime)) break;
            if (endSlotTime.isAfter(now)) {
                slots.push({
                    start: startTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    end: endSlotTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    day: 'today'
                });
            }
            startTime = endSlotTime;
        }
    }

    for (const { startHour, startMinute, endHour, endMinute } of timeRanges) {
        let nextDayStartTime = tomorrow.clone().set({ hour: startHour, minute: startMinute });
        let nextDayEndTime = tomorrow.clone().set({ hour: endHour, minute: endMinute });

        while (nextDayStartTime.isBefore(nextDayEndTime)) {
            const endSlotTime = nextDayStartTime.clone().add(duration, 'minutes');
            if (endSlotTime.isAfter(nextDayEndTime)) break;
            slots.push({
                start: nextDayStartTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                end: endSlotTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                day: 'tomorrow'
            });
            nextDayStartTime = endSlotTime;
        }
    }
    console.log(`Generated ${slots.length} Slots:`, slots);
    return slots;
};

const agenda = new Agenda({ db: { address: process.env.MONGO_URL, collection: 'jobs' } });

const timeRanges = [
    { startHour: 13, startMinute: 30, endHour: 14, endMinute: 0 },   // 1:30 PM - 2:00 PM GMT (6:30 PM PKT)
    { startHour: 14, startMinute: 0, endHour: 14, endMinute: 30 },   // 2:00 PM - 2:30 PM GMT (7:00 PM PKT)
    { startHour: 14, startMinute: 30, endHour: 15, endMinute: 0 },   // 2:30 PM - 3:00 PM GMT (7:30 PM PKT)
    { startHour: 15, startMinute: 0, endHour: 15, endMinute: 30 },   // 3:00 PM - 3:30 PM GMT (8:00 PM PKT)
    { startHour: 15, startMinute: 30, endHour: 16, endMinute: 0 },   // 3:30 PM - 4:00 PM GMT (8:30 PM PKT)
    { startHour: 16, startMinute: 0, endHour: 16, endMinute: 30 }    // 4:00 PM - 4:30 PM GMT (9:00 PM PKT)
];


const slotDuration = 30;

// 1️⃣ Job: GET existing slots
agenda.define('fetch slots', async () => {
    console.log('Fetching slots...');
    try {
        const response = await axios.get(`http://localhost:8800/api/schedule`);
        console.log(`Existing slots count: ${response.data.length}`);
    } catch (error) {
        console.error('❌ Error fetching slots:', error);
    }
});

// 2️⃣ Job: POST new slots
agenda.define('create slots', async () => {
    console.log('Creating new slots...');
    const today = moment().utc().startOf('day');
    const tomorrow = today.clone().add(1, 'day').endOf('day');

    try {
        const existingSlotsResponse = await axios.get(`http://localhost:8800/api/schedule`);
        const existingSlots = existingSlotsResponse.data;

        const todaySlots = existingSlots.filter(slot => {
            const slotTime = moment.utc(slot.startDateTime);
            return slotTime.isSameOrAfter(today) && slotTime.isBefore(tomorrow);
        });

        if (todaySlots.length >= 10) {
            console.log('✅ Enough slots exist for today, skipping creation.');
            return;
        }

        console.log('Generating new slots...');
        const slots = getSlotsForSpecificPeriod(timeRanges, slotDuration);

        for (const slot of slots) {
            if (!todaySlots.some(s => moment.utc(s.startDateTime).isSame(moment.utc(slot.start)))) {
                try {
                    const payload = { startDateTime: slot.start, endDateTime: slot.end };
                    const response = await axios.post('http://localhost:8800/api/schedule/create', payload);
                    console.log(`✅ Slot created: ${JSON.stringify(response.data)}`);
                } catch (error) {
                    console.error('❌ Error creating slot:', error);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error in create slots job:', error);
    }
});

// 3️⃣ Job: DELETE past slots
agenda.define('delete past slots', async () => {
    console.log('Deleting past slots...');
    const now = moment().utc();
    try {
        await axios.delete('http://localhost:8800/api/schedule/past', {
            data: { now: now.toISOString() }
        });
        console.log('✅ Past slots deleted successfully.');
    } catch (error) {
        console.error('❌ Error deleting past slots:', error);
    }
});

// Schedule the jobs
agenda.on('ready', async () => {
    console.log('Agenda is ready. Scheduling jobs...');
    try {
        await agenda.every('*/1 * * * *', 'fetch slots');   // Runs every 1 minute
        await agenda.every('*/1 * * * *', 'create slots');  // Runs every 1 minute
        await agenda.every('*/1 * * * *', 'delete past slots');  // Runs every 1 minute
        await agenda.start();
        console.log('✅ Jobs scheduled and Agenda started.');
    } catch (error) {
        console.error('❌ Error scheduling jobs with Agenda:', error);
    }
});

agenda.on('error', error => {
    console.error('❌ Agenda error:', error);
});


connectToDatabase().then(() => {
    console.log('Database connection successful');
}).catch(error => {
    console.error('Database connection error:', error);
});

app.use('/uploads', setCors, express.static(path.join(__dirname, 'uploads')));

function setCors(req, res, next) {
    const allowedOrigins = ['https://dashboard.avicenahealthcare.com', 'https://www.avicenahealthcare.com', 'http://localhost:5173', 'http://localhost:5174'];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

const corsOptions = {
    origin: ['https://dashboard.avicenahealthcare.com', 'https://www.avicenahealthcare.com', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
};

app.use(cors(corsOptions));
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
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});
app.use('/api/auth', authRoute);
app.use('/api/userauth', userauth);
app.use('/api/patients', authenticate, patientRoute); // Requires authentication
app.use('/api/appointments', authenticate, appointmentRoutes); // Requires authentication
app.use('/api/medical-records', authenticate, medicalRecordRoutes); // Requires authentication
app.use('/api/invoices', authenticate, invoiceRoutes); // Requires authentication
app.use('/api/payments', authenticate, paymentRoutes); // Requires authentication
app.use('/api/health-information', authenticate, healthInformationRoutes); // Requires authentication
app.use('/api/services', authenticate, servicesRoute); // Requires authentication
app.use('/api/sandgrid', authenticate, sandGridRoutes); // Requires authentication
app.use('/api/medicine', authenticate, medicineRoute); // Requires authentication
app.use('/api/doctors', authenticate, doctorRoutes); // Requires authentication
app.use('/api/web', authenticate, webRoutes); // Requires authentication
app.use('/api/v1', authenticate, webAppointmentRoutes); // Requires authentication
app.use('/api/otps', authenticate, otpDashRoutes); // Requires authentication
app.use('/api/otp', otpRoutes); // No authentication needed here
app.use('/api/stripe', authenticate, stripe); // Requires authentication
app.use('/api/', emailCampaignRoutes);
app.use('/api/', EmailSent);
app.use('/api/dental-chart', authenticate, dentalChartRoutes);
app.use('/api/schedule', schduleRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});