import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const emailCampaignSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        link: {
            type: String, // Assuming link is a string
            required: false, // Change to true if link is required
        },
        message: {
            type: String,
            required: true,
        },
        image: String, // You might want to store the image URL here
    },
    { timestamps: true } // Add timestamps option
);

export default model('EmailCampaign', emailCampaignSchema);
