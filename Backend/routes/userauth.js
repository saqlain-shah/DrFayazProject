import express from 'express';
import { login, register, changePassword, getClientById, updateClientById, logout, sendEmail, getAllUsers } from '../controllers/user.js';
import multer from 'multer';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/login', login);
router.post('/register', register);
router.get('/users', getAllUsers);
router.put('/change-password/:clientId', changePassword);
router.put('/logout', logout);
router.get('/:clientId', getClientById);
router.put('/:clientId', upload.single('image'), updateClientById);
router.post('/send-email', sendEmail);


export default router;
