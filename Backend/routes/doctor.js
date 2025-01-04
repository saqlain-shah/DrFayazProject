// doctorRoutes.js

import express from 'express';
import * as doctorController from '../controllers/Doctor/doctor.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Ensure 'uploads' folder exists

router.post('/', upload.single('profileImage'), doctorController.createDoctor);
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.put('/edit/:id', doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);

export default router;
