import mongoose from 'mongoose';

const sendgridActivitySchema = new mongoose.Schema({
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String }, // You might store delivery status here
    // Add other fields as needed
});

const SendgridActivity = mongoose.model('SendgridActivity', sendgridActivitySchema);

export default SendgridActivity;
