// routes/webAppointmentRoutes.js

import express from 'express';
import { createWebAppointmentByUnauthenticatedUser, getWebAppointments, deleteWebAppointment } from '../controllers/webAppoinment.js';

const router = express.Router();

router.post('/', createWebAppointmentByUnauthenticatedUser);
router.get('/', getWebAppointments);
router.delete('/:id', deleteWebAppointment);
export default router;
