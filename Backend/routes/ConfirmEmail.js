// routes/confirmEmail.js

import express from 'express';
import { sendAppointmentConfirmationEmail, sendDoctorAppointmentEmail } from '../controllers/ConfirmEmail.js';

const router = express.Router();

router.post('/send-confirmation-email', async (req, res) => {
  try {
    const selectValue = req.body;
    await sendAppointmentConfirmationEmail(selectValue);
    await sendDoctorAppointmentEmail(selectValue);
    res.status(200).json({ message: 'Appointment confirmation emails sent successfully' });
  } catch (error) {
    console.error('Error sending appointment confirmation emails:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
