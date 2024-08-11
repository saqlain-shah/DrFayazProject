import express from 'express';
import { getAllSchedules, createSchedule, deleteSchedule, deletePastSchedules } from '../controllers/schdule/schdule.js';

const router = express.Router();

// GET all schedules
router.get('/', getAllSchedules);

// POST a new schedule
router.post('/', createSchedule);
// DELETE past schedules
router.delete('/past', deletePastSchedules);
// DELETE a schedule by ID
router.delete('/:id', deleteSchedule);



export default router;
