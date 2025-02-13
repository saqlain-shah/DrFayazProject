import express from 'express';
import upload  from '../utils/multer.js';

import { login, register, changePassword ,updateDoctorById,updateUserById,getUserById} from '../controllers/auth.js'; // Import the changePassword function
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.put('/change-password', changePassword); // Add this line to handle the change password request
// router.put('/:docterId', updateDoctorById);
router.put('/user/:userId',upload.single('profileImage'), updateUserById);
router.get('/get/:Id', getUserById);



export default router;
