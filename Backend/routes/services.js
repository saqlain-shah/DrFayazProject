import express from 'express';
import { getAllServices, createService, getServiceById, updateService, deleteService } from '../controllers/Services/Services.js';

const router = express.Router();

router.get('/', getAllServices);

// Create a new service
router.post('/', createService);

// Get service by ID
router.get('/:id', getServiceById);

// Update service by ID
router.put('/:id', updateService);

// Delete service by ID
router.delete('/:id', deleteService);

export default router;
