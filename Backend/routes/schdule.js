// scheduleRoutes.js

import express from 'express';
import { getAllSchedules, createSchedule ,deleteSchedule} from '../controllers/schdule/schdule.js';

const router = express.Router();

// GET all schedules
router.get('/', getAllSchedules);

// POST a new schedule
router.post('/', createSchedule);


router.delete('/:id', deleteSchedule);

export default router;
