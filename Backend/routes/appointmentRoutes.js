import express from 'express';
import * as appointmentController from '../controllers/AppointmentController/appointmentController.js';

const router = express.Router();

router.route('/')
    .post(appointmentController.createAppointment)
    .get(appointmentController.getAllAppointments);
router.get('/patient/:patientId', appointmentController.getAppointmentsByPatientId);
router.get('/total-count', appointmentController.getTotalAppointmentCount);
router.get('/today', appointmentController.getAppointmentsForToday);
router.route('/:id')
    .get(appointmentController.getAppointmentById)
    .put(appointmentController.updateAppointment)
    .delete(appointmentController.deleteAppointment);

export default router;
