// controllers/emailCampaignController.js

import EmailCampaign from '../models/EmailCampaign.js';

// Controller function to create a new email campaign
export const createEmailCampaign = async (req, res) => {
    try {
        const { title, description, link, message } = req.body;
        const image = req.file;

        if (!title || !description || !message) {
            return res.status(400).json({ message: 'Title, description, and message are required fields.' });
        }

        // Create a new email campaign with form fields and image
        const newEmailCampaign = new EmailCampaign({
            title,
            description,
            
            link,
            message,
            image: image ? image.path : null // Store the image path in the database
        });
        const savedEmailCampaign = await newEmailCampaign.save();

        // Respond with the created email campaign
        res.status(201).json(savedEmailCampaign);
    } catch (error) {
        // Handle any errors
        console.error('Error creating email campaign:', error);
        res.status(500).json({ message: 'Failed to create email campaign. Please try again later.' });
    }
};

export const getEmailCampaigns = (req, res) => {
    // Assuming you have a model named EmailCampaign
    EmailCampaign.find()
        .then(emailCampaigns => {
            res.status(200).json(emailCampaigns);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

// Function to get a specific email campaign by ID
export const getEmailCampaignById = (req, res) => {
    // Assuming you have a model named EmailCampaign
    const { id } = req.params;
    EmailCampaign.findById(id)
        .then(emailCampaign => {
            if (!emailCampaign) {
                return res.status(404).json({ error: 'Email campaign not found' });
            }
            res.status(200).json(emailCampaign);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

// Function to update an email campaign by ID
export const updateEmailCampaign = (req, res) => {
    // Assuming you have a model named EmailCampaign
    const { id } = req.params;
    const updateData = req.body; // Assuming req.body contains the updated data
    EmailCampaign.findByIdAndUpdate(id, updateData, { new: true })
        .then(updatedCampaign => {
            if (!updatedCampaign) {
                return res.status(404).json({ error: 'Email campaign not found' });
            }
            res.status(200).json(updatedCampaign);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

// Function to delete an email campaign by ID
export const deleteEmailCampaign = (req, res) => {
    // Assuming you have a model named EmailCampaign
    const { id } = req.params;
    EmailCampaign.findByIdAndDelete(id)
        .then(deletedCampaign => {
            if (!deletedCampaign) {
                return res.status(404).json({ error: 'Email campaign not found' });
            }
            res.status(200).json({ message: 'Email campaign deleted successfully' });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};