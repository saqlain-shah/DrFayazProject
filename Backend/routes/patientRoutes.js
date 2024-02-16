import express from 'express';
import * as patientController from '../controllers/PatientController/patients.js';
import upload from '../utils/multerConfig.js'
const router = express.Router();

router.post('/patients', upload.single('profileImage'), patientController.createPatient);
router.get('/patients', patientController.getAllPatients);
router.get('/patients/:id', patientController.getPatientById);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);

export default router;
