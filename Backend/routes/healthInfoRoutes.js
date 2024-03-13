import express from 'express';
import * as healthInformationController from '../controllers/healthInfoController/healthInfoController.js';

const router = express.Router();

router.route('/')
    .post(healthInformationController.createHealthInformation)
    .get(healthInformationController.getAllHealthInformation);

// Add routes for getting, updating, and deleting health information by ID if needed

export default router;
