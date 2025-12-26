import express from 'express';
import { getAllSchedules, createSchedule, deleteSchedule, deletePastSchedules } from '../controllers/schdule/schdule.js';

const router = express.Router();
router.get('/', getAllSchedules);
router.post('/create', createSchedule);
router.delete('/past', deletePastSchedules);
router.delete('/:id', deleteSchedule);



export default router;
