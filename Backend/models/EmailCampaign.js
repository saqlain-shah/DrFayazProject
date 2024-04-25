import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const emailCampaignSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        header: String,
        subHeader: String,
        message: {
            type: String,
            required: true,
        },
        image: String, // You might want to store the image URL here
    },
    { timestamps: true } // Add timestamps option
);

export default model('EmailCampaign', emailCampaignSchema);
