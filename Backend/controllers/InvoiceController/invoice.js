// invoiceController.js

import Invoice from "../../models/Invoice/invoiceModel.js";

export const createInvoice = async (req, res) => {
    try {
        // Create the invoice
        const newInvoice = new Invoice(req.body.invoiceData);
        const savedInvoice = await newInvoice.save();

        // Create items associated with the invoice
        const itemsData = req.body.itemsData; // Assuming itemsData contains an array of item details
        const savedItems = await Item.insertMany(itemsData.map(item => ({ ...item, invoice: savedInvoice._id })));

        // Return the saved invoice and items data
        res.status(201).json({ invoice: savedInvoice, items: savedItems });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to get all invoices
export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get a single invoice by ID
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice === null) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to update an invoice by ID
export const updateInvoice = async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedInvoice === null) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(updatedInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to delete an invoice by ID
export const deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (deletedInvoice === null) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
