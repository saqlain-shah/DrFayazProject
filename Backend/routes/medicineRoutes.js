import express from 'express';
import { getAllMedicines, createMedicine, getMedicineById, updateMedicine, deleteMedicine } from '../controllers/Medicine/medicine.js';

const router = express.Router();

// Routes for medicines
router.get('/', getAllMedicines); // Get all medicines
router.post('/', createMedicine); // Create a new medicine
router.get('/:id', getMedicineById); // Get medicine by ID
router.put('/:id', updateMedicine); // Update medicine by ID
router.delete('/:id', deleteMedicine); // Delete medicine by ID

export default router;
