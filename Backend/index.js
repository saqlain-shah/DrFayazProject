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

const getSlotsForSpecificPeriod = (timeRanges, duration) => {
    console.log('getSlotsForSpecificPeriod is running...');

    const slots = [];
    const now = moment().utc();
    const today = now.clone().startOf('day');
    const tomorrow = today.clone().add(1, 'day');

    // Iterate through the timeRanges (you can have different ranges for each day)
    for (const { startHour, startMinute, endHour, endMinute } of timeRanges) {
        // Create slots for today
        let startTime = today.clone().set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });
        let endTime = today.clone().set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });

        while (startTime.isBefore(endTime) && slots.filter(slot => slot.day === 'today').length < 6) { 
            const endSlotTime = startTime.clone().add(duration, 'minutes');
            if (endSlotTime.isAfter(endTime)) break;

            // Push the generated slot into the slots array
            slots.push({
                start: startTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                end: endSlotTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                day: 'today' // Tag for today's slots
            });

            // Move start time to the next slot (30 min gap)
            startTime = endSlotTime;
        }

        // Create slots for tomorrow
        let nextDayStartTime = tomorrow.clone().set({ hour: startHour, minute: startMinute });
        let nextDayEndTime = tomorrow.clone().set({ hour: endHour, minute: endMinute });

        while (nextDayStartTime.isBefore(nextDayEndTime) && slots.filter(slot => slot.day === 'tomorrow').length < 6) { 
            const endSlotTime = nextDayStartTime.clone().add(duration, 'minutes');
            if (endSlotTime.isAfter(nextDayEndTime)) break;

            // Push the generated slot into the slots array for tomorrow
            slots.push({
                start: nextDayStartTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                end: endSlotTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                day: 'tomorrow' // Tag for tomorrow's slots
            });
            nextDayStartTime = endSlotTime;
        }
    }

    console.log(`Generated ${slots.length} Slots:`, slots);
    return slots;
};

const agenda = new Agenda({ db: { address: process.env.MONGO_URL, collection: 'jobs' } });

agenda.define('manage slots', async job => {
    console.log('Executing "manage slots" job...');

    // Updated timeRanges to start from 3:50 PM to 6:50 PM
    const timeRanges = [
        { startHour: 15, startMinute: 50, endHour: 16, endMinute: 20 },   // Start at 3:50 PM to 4:20 PM
        { startHour: 16, startMinute: 20, endHour: 16, endMinute: 50 },   // Next slot from 4:20 PM to 4:50 PM
        { startHour: 16, startMinute: 50, endHour: 17, endMinute: 20 },   // Next slot from 4:50 PM to 5:20 PM
        { startHour: 17, startMinute: 20, endHour: 17, endMinute: 50 },   // Next slot from 5:20 PM to 5:50 PM
        { startHour: 17, startMinute: 50, endHour: 18, endMinute: 20 },   // Next slot from 5:50 PM to 6:20 PM
        { startHour: 18, startMinute: 20, endHour: 18, endMinute: 50 },   // Next slot from 6:20 PM to 6:50 PM
    ];
    const slotDuration = 30; // Slot duration is 30 minutes

    const today = moment().utc().startOf('day');
    const tomorrow = today.clone().add(1, 'day').endOf('day');

    try {
        console.log('Fetching existing slots...');
        const existingSlotsResponse = await axios.get(`http://localhost:8800/api/schedule`);
        const existingSlots = existingSlotsResponse.data;

        console.log(`Existing slots count: ${existingSlots.length}`);

        // Filter out today's and tomorrow's slots
        const todaySlots = existingSlots.filter(slot => {
            const slotTime = moment.utc(slot.startDateTime);
            return slotTime.isSameOrAfter(today) && slotTime.isBefore(tomorrow);
        });

        console.log(`Today's slots count: ${todaySlots.length}`);

        if (todaySlots.length >= 6) {
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

        console.log('Deleting past slots...');
        await axios.delete('http://localhost:8800/api/schedule/past', { data: { now: moment().utc().toDate() } });
    } catch (error) {
        console.error('❌ Error in manage slots job:', error);
    }
});

agenda.on('ready', async () => {
    console.log('Agenda is ready. Scheduling jobs...');
    try {
        await agenda.every('*/1 * * * *', 'manage slots'); // Runs every minute
        await agenda.start();
        console.log('Agenda started and job scheduled.');
    } catch (error) {
        console.error('❌ Error scheduling job with Agenda:', error);
    }
});

agenda.on('error', error => {
    console.error('❌ Agenda error:', error);
});






// MongoDB connection
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

// Middleware to disable caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

const corsOptions = {
    origin: ['https://dashboard.avicenahealthcare.com', 'https://www.avicenahealthcare.com', 'http://localhost:5173', 'http://localhost:5174'],
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
app.use('/api/', emailCampaignRoutes); // No authentication needed here
app.use('/api/', EmailSent); // No authentication needed here
app.use('/api/dental-chart', authenticate, dentalChartRoutes);
app.use('/api/schedule', schduleRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});