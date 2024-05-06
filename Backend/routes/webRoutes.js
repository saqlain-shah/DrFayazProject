import express from 'express';
import { createWeb, getAllWebs, deleteWeb, getWebById, getNotifications, markAllNotificationsAsRead, getTodayWebAppointments, getTotalWebPatientCount, updateWeb } from '../controllers/webcontroller.js';
import upload from '../utils/multer.js';
// import multer from 'multer';


const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// Define routes for webs
router.get('/total-count', getTotalWebPatientCount);
router.get('/today-appointments', getTodayWebAppointments);

router.get('/notifications', getNotifications);

router.put('/notifications/mark-all-read', markAllNotificationsAsRead);
// Route for fetching a Web by its ID

router.get('/:id', getWebById); // Route for getting a web by ID
router.post('/', upload.array('files'), createWeb); // Route for creating a web

router.get('/', getAllWebs); // Route for getting all webs
router.put('/:id', updateWeb); // Route for updating a web
router.delete('/:id', deleteWeb); // Route for deleting a web



export default router;
