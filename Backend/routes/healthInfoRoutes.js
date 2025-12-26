// healthInfoRoutes.js

import express from 'express';
import * as healthInformationController from '../controllers/healthInfoController/healthInfoController.js';

const router = express.Router();

router.route('/')
    .post(healthInformationController.createHealthInformation)
    .get(healthInformationController.getAllHealthInformation);

router.route('/:patientId')
    .get(healthInformationController.getHealthInformationByPatientId)
    .put(healthInformationController.updateHealthInformationByPatientId)
    .delete(healthInformationController.deleteHealthInformationByPatientId);

export default router;
