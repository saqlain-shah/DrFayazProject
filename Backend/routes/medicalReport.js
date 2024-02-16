import express from 'express';
const router = express.Router();
import * as MedicalRecordController from '../controllers/MedicalReport/medicalReport.js';

// Route to create a new medical record
router.post('/medical-records', MedicalRecordController.createMedicalRecord);

// Route to get all medical records
router.get('/medical-records', MedicalRecordController.getAllMedicalRecords);

// Route to get a medical record by ID
router.get('/medical-records/:id', MedicalRecordController.getMedicalRecordById);

// Route to update a medical record by ID
router.put('/medical-records/:id', MedicalRecordController.updateMedicalRecord);

// Route to delete a medical record by ID
router.delete('/medical-records/:id', MedicalRecordController.deleteMedicalRecord);

export default router;