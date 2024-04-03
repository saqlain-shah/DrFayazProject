import express from 'express';
import { login, register, changePassword, getClientById, updateClientById, logout } from '../controllers/user.js';
import multer from 'multer';
// Import the changePassword function
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/login',login);
router.post('/register', register);
router.put('/change-password/:clientId', changePassword);
router.put('/logout', logout);
router.get('/:clientId', getClientById);
router.put('/:clientId',upload.single('image'), updateClientById);

export default router;
