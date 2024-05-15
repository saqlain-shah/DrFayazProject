// routes/dentalChartRoutes.js
import express from 'express';
import { create, remove, list, getById } from '../controllers/dentalChartController.js';

const router = express.Router();

router.post('/', create);
router.delete('/:id', remove);
router.get('/', list);

// Route to get a specific dental chart record by ID
router.get('/:id', getById);

export default router;
