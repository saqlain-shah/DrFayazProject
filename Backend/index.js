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

    let todayCount = 0;
    let tomorrowCount = 0;
    const MAX_SLOTS_PER_DAY = 9;
    for (const { startHour, startMinute, endHour, endMinute } of timeRanges) {
        if (todayCount >= MAX_SLOTS_PER_DAY) break; // 🔒 Stop if limit reached

        let startTime = today.clone().set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
        let endTime = today.clone().set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });

        while (startTime.isBefore(endTime) && todayCount < MAX_SLOTS_PER_DAY) {
            const endSlotTime = startTime.clone().add(duration, 'minutes');
            if (endSlotTime.isAfter(endTime)) break;
            if (endSlotTime.isAfter(now)) {
                slots.push({
                    start: startTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    end: endSlotTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    day: 'today'
                });
                todayCount++;
            }
            startTime = endSlotTime;
        }
    }
    for (const { startHour, startMinute, endHour, endMinute } of timeRanges) {
        if (tomorrowCount >= MAX_SLOTS_PER_DAY) break; // 🔒 Stop if limit reached

        let nextDayStartTime = tomorrow.clone().set({ hour: startHour, minute: startMinute });
        let nextDayEndTime = tomorrow.clone().set({ hour: endHour, minute: endMinute });

        while (nextDayStartTime.isBefore(nextDayEndTime) && tomorrowCount < MAX_SLOTS_PER_DAY) {
            const endSlotTime = nextDayStartTime.clone().add(duration, 'minutes');
            if (endSlotTime.isAfter(nextDayEndTime)) break;
            slots.push({
                start: nextDayStartTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                end: endSlotTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                day: 'tomorrow'
            });
            tomorrowCount++;
            nextDayStartTime = endSlotTime;
        }
    }
    console.log(`Generated ${slots.length} Slots (Today: ${todayCount}, Tomorrow: ${tomorrowCount}):`, slots);
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
agenda.define('fetch slots', async () => {
    console.log('Fetching slots...');
    try {
        const response = await axios.get(`http://localhost:8800/api/schedule`);
        console.log(`Existing slots count: ${response.data.length}`);
    } catch (error) {
        console.error('❌ Error fetching slots:', error);
    }
});
agenda.define('create slots', async () => {
    console.log('Creating slots...');
    const slotDuration = 20;
    const MAX_SLOTS_PER_DAY = 9; // Maximum slots updated for 20-minute intervals

    try {
        const response = await axios.get(`http://localhost:8800/api/schedule`);
        const existingSlots = response.data || [];

        const todayDate = moment().utc().format('YYYY-MM-DD');
        const tomorrowDate = moment().utc().add(1, 'day').format('YYYY-MM-DD');

        const todaySlotsCount = existingSlots.filter(slot =>
            moment(slot.startDateTime).utc().format('YYYY-MM-DD') === todayDate
        ).length;

        const tomorrowSlotsCount = existingSlots.filter(slot =>
            moment(slot.startDateTime).utc().format('YYYY-MM-DD') === tomorrowDate
        ).length;

        console.log(`🔎 Existing slots - Today: ${todaySlotsCount}, Tomorrow: ${tomorrowSlotsCount}`);
        const timeRanges = [
            { startHour: 18, startMinute: 0, endHour: 18, endMinute: 20 },  // 6:00 PM - 6:20 PM GMT
            { startHour: 18, startMinute: 20, endHour: 18, endMinute: 40 }, // 6:20 PM - 6:40 PM GMT
            { startHour: 18, startMinute: 40, endHour: 19, endMinute: 0 },  // 6:40 PM - 7:00 PM GMT
            { startHour: 19, startMinute: 0, endHour: 19, endMinute: 20 },  // 7:00 PM - 7:20 PM GMT
            { startHour: 19, startMinute: 20, endHour: 19, endMinute: 40 }, // 7:20 PM - 7:40 PM GMT
            { startHour: 19, startMinute: 40, endHour: 20, endMinute: 0 },  // 7:40 PM - 8:00 PM GMT
            { startHour: 20, startMinute: 0, endHour: 20, endMinute: 20 },  // 8:00 PM - 8:20 PM GMT
            { startHour: 20, startMinute: 20, endHour: 20, endMinute: 40 }, // 8:20 PM - 8:40 PM GMT
            { startHour: 20, startMinute: 40, endHour: 21, endMinute: 0 },  // 8:40 PM - 9:00 PM GMT
        ];

        const slots = getSlotsForSpecificPeriod(timeRanges, slotDuration);

        let createdToday = todaySlotsCount;
        let createdTomorrow = tomorrowSlotsCount;

        for (const slot of slots) {
            if (slot.day === 'today' && createdToday >= MAX_SLOTS_PER_DAY) continue;
            if (slot.day === 'tomorrow' && createdTomorrow >= MAX_SLOTS_PER_DAY) continue;

            const payload = { startDateTime: slot.start, endDateTime: slot.end };
            await axios.post('http://localhost:8800/api/schedule/create', payload);
            console.log(`✅ Slot created: ${JSON.stringify(payload)}`);

            if (slot.day === 'today') createdToday++;
            if (slot.day === 'tomorrow') createdTomorrow++;
        }

        console.log(`🎯 Final slots count - Today: ${createdToday}, Tomorrow: ${createdTomorrow}`);
    } catch (error) {
        console.error('❌ Error creating slots:', error);
    }
});
agenda.define('fetch slots', async () => {
    console.log('Fetching slots...');
    try {
        const response = await axios.get(`http://localhost:8800/api/schedule`);
        console.log(`✅ Fetched ${response.data.length} slots`);
    } catch (error) {
        console.error('❌ Error fetching slots:', error);
    }
});
agenda.define('delete past slots', async () => {
    console.log('Deleting past slots...');
    const now = moment().utc();
    try {
        const response = await axios.delete('http://localhost:8800/api/schedule/past', {
            data: { now: now.toISOString() }
        });
        console.log(`✅ Past slots deleted: ${response.data.removedCount}`);
    } catch (error) {
        console.error('❌ Error deleting past slots:', error);
    }
});
agenda.on('ready', async () => {
    console.log('Agenda is ready. Scheduling jobs for testing...');
    try {
        await agenda.every('*/1 * * * *', 'create slots');  // Runs every 1 minute
        await agenda.every('*/1 * * * *', 'fetch slots');   // Runs every 1 minute


        await agenda.every('*/1 * * * *', 'delete past slots');

        await agenda.start();
        console.log('✅ All jobs scheduled and Agenda started.');
    } catch (error) {
        console.error('❌ Error scheduling jobs with Agenda:', error);
    }
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
app.use('/api/patients', authenticate, patientRoute);
app.use('/api/appointments', authenticate, appointmentRoutes);
app.use('/api/medical-records', authenticate, medicalRecordRoutes);
app.use('/api/invoices', authenticate, invoiceRoutes);
app.use('/api/payments', authenticate, paymentRoutes);
app.use('/api/health-information', authenticate, healthInformationRoutes);
app.use('/api/services', authenticate, servicesRoute);
app.use('/api/sandgrid', authenticate, sandGridRoutes);
app.use('/api/medicine', authenticate, medicineRoute);
app.use('/api/doctors', authenticate, doctorRoutes);
app.use('/api/web', authenticate, webRoutes);
app.use('/api/v1', authenticate, webAppointmentRoutes);
app.use('/api/otps', authenticate, otpDashRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/stripe', authenticate, stripe);
app.use('/api/', emailCampaignRoutes);
app.use('/api/', EmailSent);
app.use('/api/dental-chart', authenticate, dentalChartRoutes);
app.use('/api/schedule', schduleRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});