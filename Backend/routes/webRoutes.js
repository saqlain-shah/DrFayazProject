import express from 'express';
import { createWeb, getAllWebs, deleteWeb, getWebById, getTodayWebAppointments, getTotalWebPatientCount, updateWeb } from '../controllers/webcontroller.js';

const router = express.Router();

// Define routes for webs
router.get('/total-count', getTotalWebPatientCount);
router.get('/today-appointments', getTodayWebAppointments);
router.get('/:id', getWebById); // Route for getting a web by ID
router.post('/', createWeb); // Route for creating a web

router.get('/', getAllWebs); // Route for getting all webs
router.put('/:id', updateWeb); // Route for updating a web
router.delete('/:id', deleteWeb); // Route for deleting a web
export default router;
