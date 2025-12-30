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
app.get('/', (req, res) => {
    const port = process.env.PORT || 8800;

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Backend Status</title>
            <style>
                body {
                    margin: 0;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #f7f9fc;
                    font-family: Arial, Helvetica, sans-serif;
                }
                .container {
                    text-align: center;
                }
                h1 {
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                p {
                    color: #555;
                    margin: 5px 0;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Backend API is Running 🚀</h1>
                <p>Status: <strong>OK</strong></p>
                <p>Port: <strong>${port}</strong></p>
            </div>
        </body>
        </html>
    `);
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// console.log('MongoDB URI:', process.env.MONGO_URL);
const getSlotsForSpecificPeriod = (timeRanges, duration, maxSlots, dayLabel, existingCount) => {
    // console.log(`Generating slots for ${dayLabel}...`);
    const slots = [];
    const now = moment().utc();
    const targetDay = now.clone().startOf('day');

    if (dayLabel === 'tomorrow') {
        targetDay.add(1, 'day');
    }

    let slotCount = existingCount;

    for (const { startHour, startMinute, endHour, endMinute } of timeRanges) {
        if (slotCount >= maxSlots) break; // Stop if limit reached

        let startTime = targetDay.clone().set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
        let endTime = targetDay.clone().set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });

        while (startTime.isBefore(endTime) && slotCount < maxSlots) {
            const endSlotTime = startTime.clone().add(duration, 'minutes');
            if (endSlotTime.isAfter(endTime)) break;
            if (endSlotTime.isAfter(now)) {
                slots.push({
                    start: startTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    end: endSlotTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                    day: dayLabel
                });
                slotCount++;
            }
            startTime = endSlotTime;
        }
    }

    // console.log(`Generated ${slots.length} Slots for ${dayLabel}:`, slots);
    return slots;
};
const agenda = new Agenda({ db: { address: process.env.MONGO_URL, collection: 'jobs' } });
agenda.define('create slots', async () => {
    // console.log('Creating slots...');
    const slotDuration = 20;
    try {
        const response = await axios.get(`https://www.avicenahealthcare.com/api/schedule`);
        const existingSlots = response.data || [];
        const todayDate = moment().utc().format('YYYY-MM-DD');
        const tomorrowDate = moment().utc().add(1, 'day').format('YYYY-MM-DD');
        const todaySlotsCount = existingSlots.filter(slot =>
            moment(slot.startDateTime).utc().format('YYYY-MM-DD') === todayDate
        ).length;
        const tomorrowSlotsCount = existingSlots.filter(slot =>
            moment(slot.startDateTime).utc().format('YYYY-MM-DD') === tomorrowDate
        ).length;
        // console.log(`🔎 Existing slots - Today: ${todaySlotsCount}, Tomorrow: ${tomorrowSlotsCount}`);
        const isWeekend = [6, 7].includes(moment().utc().isoWeekday());
        const isTomorrowWeekend = [6, 7].includes(moment().utc().add(1, 'day').isoWeekday());
        const weekdayTimeRanges = [
            { startHour: 18, startMinute: 0, endHour: 18, endMinute: 20 },
            { startHour: 18, startMinute: 20, endHour: 18, endMinute: 40 },
            { startHour: 18, startMinute: 40, endHour: 19, endMinute: 0 },
            { startHour: 19, startMinute: 0, endHour: 19, endMinute: 20 },
            { startHour: 19, startMinute: 20, endHour: 19, endMinute: 40 },
            { startHour: 19, startMinute: 40, endHour: 20, endMinute: 0 },
            { startHour: 20, startMinute: 0, endHour: 20, endMinute: 20 },
            { startHour: 20, startMinute: 20, endHour: 20, endMinute: 40 },
            { startHour: 20, startMinute: 40, endHour: 21, endMinute: 0 },
        ];
        const weekendTimeRanges = [];
        let weekendStartHour = 10;
        let weekendStartMinute = 0;
        for (let i = 0; i < 33; i++) {
            let endMinute = weekendStartMinute + 20;
            let endHour = weekendStartHour;
            if (endMinute >= 60) {
                endMinute -= 60;
                endHour += 1;
            }
            weekendTimeRanges.push({ startHour: weekendStartHour, startMinute: weekendStartMinute, endHour, endMinute });
            weekendStartHour = endHour;
            weekendStartMinute = endMinute;
        }
        const todaySlots = getSlotsForSpecificPeriod(
            isWeekend ? weekendTimeRanges : weekdayTimeRanges,
            slotDuration,
            isWeekend ? 33 : 9,
            'today',
            todaySlotsCount
        );
        const tomorrowSlots = getSlotsForSpecificPeriod(
            isTomorrowWeekend ? weekendTimeRanges : weekdayTimeRanges,
            slotDuration,
            isTomorrowWeekend ? 33 : 9,
            'tomorrow',
            tomorrowSlotsCount
        );
        const slotsToCreate = [...todaySlots, ...tomorrowSlots];

        for (const slot of slotsToCreate) {
            const payload = { startDateTime: slot.start, endDateTime: slot.end };
            await axios.post('https://www.avicenahealthcare.com/api/schedule/create', payload);
            // console.log(`✅ Slot created: ${JSON.stringify(payload)}`);
        }
        // console.log(`🎯 Final slots count - Today: ${todaySlots.length}, Tomorrow: ${tomorrowSlots.length}`);
    } catch (error) {
        console.error('❌ Error creating slots:', error);
    }
});
agenda.define('fetch slots', async () => {
    // console.log('Fetching slots...');
    try {
        const response = await axios.get(`https://www.avicenahealthcare.com/api/schedule`);
        // console.log(`✅ Fetched ${response.data.length} slots`);
    } catch (error) {
        console.error('❌ Error fetching slots:', error);
    }
});
agenda.define('delete past slots', async () => {
    // console.log('Deleting past slots...');
    const now = moment().utc();
    try {
        const response = await axios.delete('https://www.avicenahealthcare.com/api/schedule/past', {
            data: { now: now.toISOString() }
        });
        // console.log(`✅ Past slots deleted: ${response.data.removedCount}`);
    } catch (error) {
        console.error('❌ Error deleting past slots:', error);
    }
});
agenda.on('ready', async () => {
    try {
        await agenda.every('*/1 * * * *', 'create slots');  // Runs every 1 minute
        await agenda.every('*/15 * * * *', 'fetch slots'); // Runs every 15 minutes
        await agenda.every('*/1 * * * *', 'delete past slots');
        await agenda.start();
        // console.log('✅ All jobs scheduled and Agenda started.');
    } catch (error) {
        console.error('❌ Error scheduling jobs with Agenda:', error);
    }
});
connectToDatabase().then(() => {
    // console.log('Database connection successful');
}).catch(error => {
    console.error('Database connection error:', error);
});
app.use('/uploads', setCors, express.static(path.join(__dirname, 'uploads')));
function setCors(req, res, next) {
    const allowedOrigins = ['https://admin.avicenahealthcare.com', 'https://www.avicenahealthcare.com', 'http://localhost:5173', 'http://localhost:5174','https://www.avicenahealthcare.com/api','http://www.avicenahealthcare.com/api'];

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
    origin: ['https://admin.avicenahealthcare.com', 'https://www.avicenahealthcare.com','https://www.avicenahealthcare.com/api', 'http://localhost:5173', 'http://localhost:5174'],
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