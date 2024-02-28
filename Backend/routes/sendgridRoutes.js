import express from 'express';
import * as sendgridController from '../controllers/sendgridController.js/sendgridController.js';

const router = express.Router();

router.post('/send-confirmation-email', sendgridController.sendConfirmationEmail);

export default router;
