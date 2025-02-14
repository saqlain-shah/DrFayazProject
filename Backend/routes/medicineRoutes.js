import express from 'express';
import { getAllMedicines, createMedicine, getMedicineById, updateMedicine, deleteMedicine } from '../controllers/Medicine/medicine.js';

const router = express.Router();

// Routes for medicines
router.get('/', getAllMedicines);
router.post('/', createMedicine);
router.get('/:id', getMedicineById);
router.put('/:id', updateMedicine); // Update medicine by ID
router.delete('/:id', deleteMedicine); // Delete medicine by ID

export default router;
