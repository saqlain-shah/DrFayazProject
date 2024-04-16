// Inside webRoutes.js

import express from 'express';
import { createAppointment, getAllAppointments, getAppointmentById, updateAppointment, deleteAppointment } from '../controllers/webController.js';

const router = express.Router();

// Define routes for appointments
router.post('/', createAppointment);
router.get('/:id', getAppointmentById);
router.get('/', getAllAppointments);
router.put('/:id', updateAppointment); // Route for updating appointment
router.delete('/:id', deleteAppointment); // Route for deleting appointment

export default router;
