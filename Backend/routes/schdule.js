import express from 'express';
import { getAllSchedules, createSchedule, deleteSchedule, deletePastSchedules } from '../controllers/schdule/schdule.js';

const router = express.Router();
router.get('/', getAllSchedules);
router.post('/', createSchedule);
// DELETE past schedules
router.delete('/past', deletePastSchedules);
// DELETE a schedule by ID
router.delete('/:id', deleteSchedule);



export default router;
