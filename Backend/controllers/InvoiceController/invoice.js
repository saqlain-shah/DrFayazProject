// controllers/invoiceController.js
import Invoice from '../../models/Invoice/invoiceModel.js';

// Create a new invoice
export const createInvoice = async (req, res) => {
    try {
        const { selectedPatient, selectedService, invoiceItems } = req.body;

        // Extract patient details from selectedPatient object
        const { _id: patient } = selectedPatient;

        // Extract service details from selectedService object
        const services = selectedService ? [selectedService._id] : [];

        // Calculate total based on invoiceItems
        const total = invoiceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Calculate dueDate (example: due in 30 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        // Create the invoice
        const invoice = new Invoice({
            patient,
            services,
            invoiceItems,
            total,
            dueDate,
        });

        // Save the invoice
        await invoice.save();

        // Fetch the newly created invoice with populated fields
        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate('patient', 'fullName email profilePicture')
            .populate('services', 'name');

        // Respond with the populated invoice
        res.status(201).json(populatedInvoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
};



// Get all invoices
export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('patient', 'fullName email profilePicture') // Populate patient details
            .populate('services', 'name'); // Populate service names
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('patient', 'fullName email profilePicture') // Populate patient details
            .populate('services', 'name'); // Populate service names
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error fetching invoice by ID:', error);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
};

// Update invoice by ID
export const updateInvoice = async (req, res) => {
    try {
        const { patient, services, invoiceItems, total, dueDate } = req.body;
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, {
            patient,
            services,
            invoiceItems,
            total,
            dueDate
        }, { new: true });
        if (!updatedInvoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json(updatedInvoice);
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ error: 'Failed to update invoice' });
    }
};

export const deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
};
