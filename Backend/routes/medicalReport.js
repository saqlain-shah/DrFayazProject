import express from 'express';
import * as MedicalRecordController from '../controllers/MedicalReport/medicalReport.js';

const router = express.Router();

router.route('/')
    .post(MedicalRecordController.createMedicalRecord)
    .get(MedicalRecordController.getAllMedicalRecords);

router.route('/:id')
    .put(MedicalRecordController.updateMedicalRecord)
    .delete(MedicalRecordController.deleteMedicalRecord);

router.route('/preview/:id').get(MedicalRecordController.getMedicalRecordsByPatientId);
export default router;
