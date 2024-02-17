import express from 'express';
import * as patientController from '../controllers/PatientController/patients.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

router.route('/')
    .post(upload.single('profileImage'), patientController.createPatient)
    .get(patientController.getAllPatients);

router.route('/:id')
    .get(patientController.getPatientById)
    .put(patientController.updatePatient)
    .delete(patientController.deletePatient);

export default router;
