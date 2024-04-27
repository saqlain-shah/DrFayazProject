import express from 'express';
import { login, register, changePassword ,updateDoctorById} from '../controllers/auth.js'; // Import the changePassword function
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.put('/change-password', changePassword); // Add this line to handle the change password request
router.put('/:docterId', updateDoctorById);

export default router;
