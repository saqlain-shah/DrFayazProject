// doctorRoutes.js

import express from 'express';
import * as doctorController from '../controllers/Doctor/doctor.js';
import multer from 'multer';
import { upload } from '../utils/multerConfig.js';

const router = express.Router();
// const upload = multer({ dest: 'uploads/' }); 

router.post('/', upload.single('profileImage'), doctorController.createDoctor);
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.put('/update/:id',upload.single('profileImage'), doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);

export default router;