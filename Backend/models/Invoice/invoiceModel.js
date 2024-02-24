import mongoose from 'mongoose';

// Define schema for item
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
});

// Create model for item schema
const Item = mongoose.model('Item', itemSchema);

// Define schema for invoice
const invoiceSchema = new mongoose.Schema({
    invoice_id: { type: String, required: true },
    generate_date: { type: Date, required: true },
    date: { type: Date, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], // array of item references
    currency: { type: String, enum: ['pkr', 'usd', 'euro'], required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    additional_notes: { type: String },
    payment_type: { type: String, enum: ['cash', 'bank transfer'], required: true },
    status: { type: String, enum: ['paid', 'cancel', 'pending'], required: true }
});

// Create model for invoice schema
const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
