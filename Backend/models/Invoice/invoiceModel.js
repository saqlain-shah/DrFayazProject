import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
    item: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    items: [invoiceItemSchema],
    dates: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    },
    currency: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
