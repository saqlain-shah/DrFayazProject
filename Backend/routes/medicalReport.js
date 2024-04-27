import express from 'express';
import * as MedicalRecordController from '../controllers/MedicalReport/medicalReport.js';

const router = express.Router();

router.route('/')
<<<<<<< HEAD
    .post( MedicalRecordController.createMedicalRecord)
=======
    .post(MedicalRecordController.createMedicalRecord)
>>>>>>> 4cf4ca24e4b49bd00c42f24f9dbdfc3d5121bf44
    .get(MedicalRecordController.getAllMedicalRecords);

// Make sure this line is correctly pointing to the controller function

router.route('/:id')
    .put(MedicalRecordController.updateMedicalRecord)
    .delete(MedicalRecordController.deleteMedicalRecord);

router.route('/preview/:id').get(MedicalRecordController.getMedicalRecordsByPatientId);
export default router;



