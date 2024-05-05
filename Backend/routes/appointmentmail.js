import express from 'express';
import sendAppointmentConfirmationEmail from '../controllers/appointmentmail.js';

const router = express.Router();

// POST route for sending appointment confirmation email
router.post('/send-confirmation-email', async (req, res) => {
  try {
    // Assuming you receive necessary data in the request body
    const selectValue = req.body;
    await sendAppointmentConfirmationEmail(selectValue);
    // Send email to davbabu1122@gmail.com
    await sendAppointmentConfirmationEmail({ ...selectValue, email: 'davbabu1122@gmail.com' });
    res.status(200).json({ message: 'Appointment confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
