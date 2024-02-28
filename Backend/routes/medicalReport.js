import express from 'express';
import * as MedicalRecordController from '../controllers/MedicalReport/medicalReport.js';
import { upload } from '../utils/multerConfig.js';

const router = express.Router();

router.route('/')
    .post(MedicalRecordController.createMedicalRecord)
    .get(MedicalRecordController.getAllMedicalRecords);

router.route('/:id')
    .get(MedicalRecordController.getMedicalRecordById)
    .put(MedicalRecordController.updateMedicalRecord)
    .delete(MedicalRecordController.deleteMedicalRecord);

export default router;
