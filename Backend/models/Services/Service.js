import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        status: { type: Boolean, default: false } // Add the status field with a default value of false
    },
    {
        timestamps: { createdAt: 'createdAt' }
    }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
