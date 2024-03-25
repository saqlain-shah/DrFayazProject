import express from 'express';
import { login, register, changePassword, getClientById, updateClientById } from '../controllers/user.js'; // Import the changePassword function
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.put('/change-password/:clientId', changePassword);
router.get('/:clientId', getClientById);
router.put('/:clientId', updateClientById);

export default router;
