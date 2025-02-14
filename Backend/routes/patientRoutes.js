import express from 'express';
import * as patientController from '../controllers/PatientController/patients.js';
import { upload } from '../utils/multerConfig.js';

const router = express.Router();

router.route('/')
    .post(upload.single('profilePicture'), patientController.createPatient)
    .get(patientController.getAllPatients);
router.get('/total-count', patientController.getTotalPatientCount);
router.get('/recent', patientController.fetchRecentPatients);
router.route('/:id')
    .get(patientController.getPatientById)
    .put(patientController.updatePatient)
    .delete(patientController.deletePatient);
router.put('/:userId/change-password', patientController.changePassword);

export default router;
