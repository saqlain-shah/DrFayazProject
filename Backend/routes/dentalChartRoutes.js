// routes/dentalChartRoutes.js
import express from 'express';
import { create, remove, list,getByPatientId } from '../controllers/dentalChartController.js';

const router = express.Router();

router.post('/', create);
router.delete('/:id', remove);
router.get('/', list);
router.get("/:patientId", getByPatientId);

export default router;
