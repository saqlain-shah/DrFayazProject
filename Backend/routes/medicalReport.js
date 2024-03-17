import express from 'express';
import * as MedicalRecordController from '../controllers/MedicalReport/medicalReport.js';

const router = express.Router();

router.route('/')
    .post(MedicalRecordController.createMedicalRecord)
    .get(MedicalRecordController.getAllMedicalRecords);

// Make sure this line is correctly pointing to the controller function

router.route('/:id')
    // .get(MedicalRecordController.getMedicalRecordById)
    .put(MedicalRecordController.updateMedicalRecord)
    .delete(MedicalRecordController.deleteMedicalRecord);

export default router;



