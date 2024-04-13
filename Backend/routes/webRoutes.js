import express from 'express';
import { createAppointment, getAllAppointments, getAppointmentById } from '../controllers/webcontroller.js';

const router = express.Router();

// Define routes for appointments
router.post('/', createAppointment);
router.get('/:id', getAppointmentById);
router.get('/', getAllAppointments);

export default router;
