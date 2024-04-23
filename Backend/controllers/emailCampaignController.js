// controllers/emailCampaignController.js

const express = require('express');
const router = express.Router();
const EmailCampaign = require('../models/EmailCampaign');

// POST route to create a new email campaign
router.post('/emailCampaigns', async (req, res) => {
    try {
        const newCampaign = await EmailCampaign.create(req.body);
        res.status(201).json(newCampaign);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
