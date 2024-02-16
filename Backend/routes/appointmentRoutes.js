import express from 'express';
const router = express.Router();
import * as appointmentController from '../controllers/AppointmentController/appointmentController.js';
// Routes for appointments
router.post('/appointments', appointmentController.createAppointment);
router.get('/appointments', appointmentController.getAllAppointments);
router.get('/appointments/:id', appointmentController.getAppointmentById);
router.put('/appointments/:id', appointmentController.updateAppointment);
router.delete('/appointments/:id', appointmentController.deleteAppointment);

export default router;
