// controllers/invoiceController.js
import Invoice from '../../models/Invoice/invoiceModel.js';

export const createInvoice = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Add this line to log the request body

        const { selectedPatient, selectedService, invoiceItems, tax, discount, currency } = req.body;

        // Calculate subtotal
        const subtotal = invoiceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Use the grandTotal from the request body
        const grandTotal = req.body.grandTotal;

        console.log('Grand total:', grandTotal); // Add this line to log the calculated grand total

        // Create new invoice instance
        const invoice = new Invoice({
            patient: selectedPatient._id,
            services: selectedService ? [selectedService._id] : [],
            invoiceItems,
            total: grandTotal,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            currency: currency // Add the currency to the invoice object
        });

        // Save the invoice to the database
        await invoice.save();

        // Populate patient and service details in the invoice
        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate('patient', 'fullName email profilePicture')
            .populate('services', 'name');

        // Return the created invoice along with the grand total from the request body
        // Return the created invoice along with the grand total from the request body
        res.status(201).json({ invoice: populatedInvoice, grandTotal, tax, discount, currency });

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


export const updateInvoice = async (req, res) => {
    try {
        const { tax, discount } = req.body;

        // Find the invoice by ID and update it with new data
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, {
            ...req.body,
            grandTotal: (req.body.total || 0) - (discount || 0) + (tax || 0)
        }, { new: true });

        // If the invoice doesn't exist, return 404 error
        if (!updatedInvoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Return the updated invoice along with the total
        res.status(200).json({ invoice: updatedInvoice, total: updatedInvoice.total });
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
