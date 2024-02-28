import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
    {
        medicineName: { type: String, required: true },
        measure: { type: String, required: true },
        price: { type: Number, required: true },
        inStock: { type: Boolean, default: true }, // Assuming medicine is in stock by default
        description: { type: String, required: true }
    },
    {
        timestamps: { createdAt: 'createdAt' }
    }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
