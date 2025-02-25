import express from 'express';
import { createWeb, getAllWebs, deleteWeb, getWebById, getNotifications, markAllNotificationsAsRead, getTodayWebAppointments, getTotalWebPatientCount, updateWeb, getWebByIds } from '../controllers/webcontroller.js';
import upload from '../utils/multer.js';
// import multer from 'multer';


const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

router.get('/total-count', getTotalWebPatientCount);
router.get('/today-appointments', getTodayWebAppointments);

router.get('/notifications', getNotifications);

router.get('/web/:id', getWebByIds); // Route for getting a web by ID
router.put('/notifications/mark-all-read', markAllNotificationsAsRead);

router.get('/:id', getWebById); // Route for getting a web by ID
router.post('/', upload.array('files'), createWeb); // Route for creating a web

router.get('/', getAllWebs);
router.put('/:id', updateWeb);
router.delete('/:id', deleteWeb);



export default router;
