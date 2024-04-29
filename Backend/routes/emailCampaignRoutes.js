// routes/emailCampaignRoutes.js

import express from 'express';
import multer from 'multer'; // Import multer for handling file uploads
import { createEmailCampaign, getEmailCampaigns, getEmailCampaignById, updateEmailCampaign, deleteEmailCampaign } from '../controllers/emailCampaignController.js';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name for the uploaded file
    }
});

// Create multer instance with specified storage
const upload = multer({ storage: storage });

// Route to create a new email campaign with file upload
router.post('/email-campaigns', upload.single('image'), createEmailCampaign);

// Route to get all email campaigns
router.get('/email-campaigns', getEmailCampaigns);

// Route to get a specific email campaign by ID
router.get('/email-campaigns/:id', getEmailCampaignById);

// Route to update an email campaign by ID
router.put('/email-campaigns/:id', updateEmailCampaign);

// Route to delete an email campaign by ID
router.delete('/email-campaigns/:id', deleteEmailCampaign);

export default router;
