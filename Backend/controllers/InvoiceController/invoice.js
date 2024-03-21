// controllers/invoiceController.js
import Invoice from '../../models/Invoice/invoiceModel.js';

// Create a new invoice
export const createInvoice = async (req, res) => {
    try {
        const { selectedPatient, selectedService, invoiceItems } = req.body;

        // Check if selectedPatient is defined and has an _id property
        if (!selectedPatient || !selectedPatient._id) {
            return res.status(400).json({ error: 'Please provide a valid patient' });
        }

        const { _id: patient } = selectedPatient;

        const services = selectedService ? [selectedService._id] : [];

        const total = invoiceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        const invoice = new Invoice({
            patient,
            services,
            invoiceItems,
            total,
            dueDate,
        });

        await invoice.save();

        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate('patient', 'fullName email profilePicture')
            .populate('services', 'name');

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

export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params; // Extract invoice ID from request parameters
        const invoice = await Invoice.findById(id)
            .populate('patient', 'fullName email profilePicture')
            .populate('services', 'name');

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
// controllers/invoiceController.js

// Get invoices by patient ID
export const getInvoicesByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        console.log('Patient ID:', patientId); // Add this line

        // Find invoices for the specified patient ID
        const invoices = await Invoice.find({ patient: patientId })
            .populate('patient', 'fullName email profilePicture')
            .populate('services', 'name');
        console.log('Invoices:', invoices); // Add this line

        if (invoices.length === 0) {
            return res.status(404).json({ error: 'No invoices found for the specified patient ID' });
        }

        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching invoices by patient ID:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
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
