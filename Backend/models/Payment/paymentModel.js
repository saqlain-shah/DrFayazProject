import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    status: { type: String, required: true },
    user: { type: String, required: true }, // Assuming this represents the payer
    items: [{ type: String, required: true }], // Adjusted to an array of strings
    date: { type: Date, default: Date.now },
    dueDate: { type: Date },
    paidBy: { type: String }, // Assuming this represents the entity who paid
    currency: { type: String },
    subTotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    tax: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    notes: { type: String }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
