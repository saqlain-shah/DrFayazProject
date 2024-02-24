// server.js
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
import healthInfoRoutes from './routes/healthInfoRoutes.js';

const app = express();
dotenv.config();

setupMiddleware();

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('http://localhost:5173/');
});

app.use('/api/auth', authRoute);
app.use('/api/patients', patientRoute);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/healthInfo', healthInfoRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server is running on port ${PORT}`);
});
