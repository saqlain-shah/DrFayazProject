import express from 'express';
import upload  from '../utils/multer.js';

import { login, register, changePassword ,updateDoctorById,updateUserById,getUserById} from '../controllers/auth.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.put('/change-password', changePassword);
// router.put('/:docterId', updateDoctorById);
router.put('/user/:userId',upload.single('profileImage'), updateUserById);
router.get('/get/:Id', getUserById);



export default router;
