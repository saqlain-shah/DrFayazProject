import express from 'express';
import * as healthInfoController from '../controllers/healthInfoController/healthInfoController.js';

const router = express.Router();

// Handle requests for creating new health information and getting all health information
router.route('/')
    .post(healthInfoController.createHealthInfo)
    .get(healthInfoController.getAllHealthInfo); // Import the getAllHealthInfo function here

// Handle requests for getting, updating, and deleting specific health information by ID
router.route('/:id')
    .get(healthInfoController.getHealthInfoById)
    .put(healthInfoController.updateHealthInfo)
    .delete(healthInfoController.deleteHealthInfo);

export default router;
