import express from 'express';
import { getAllMedicines, createMedicine, getMedicineById, updateMedicine, deleteMedicine } from '../controllers/Medicine/medicine.js';

const router = express.Router();

// Routes for medicines
router.get('/', getAllMedicines);
router.post('/', createMedicine);
router.get('/:id', getMedicineById);
router.put('/:id', updateMedicine); 
router.delete('/:id', deleteMedicine); 

export default router;
