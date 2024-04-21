import express from 'express';
import { createWeb, getAllWebs, deleteWeb, getWebById, getTotalWebCount, updateWeb } from '../controllers/webcontroller.js';

const router = express.Router();

// Define routes for webs
router.post('/', createWeb); // Route for creating a web
router.get('/:id', getWebById); // Route for getting a web by ID
router.get('/', getAllWebs); // Route for getting all webs
router.put('/:id', updateWeb); // Route for updating a web
router.delete('/:id', deleteWeb); // Route for deleting a web
router.get('/count', getTotalWebCount);


export default router;
