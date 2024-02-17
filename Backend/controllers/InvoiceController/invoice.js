import Invoice from '../../models/Invoice/invoiceModel.js';

export const createInvoice = async (req, res, next) => {
    try {
        // Extract data from the request body
        const { from, to, items, dates, currency, discount, tax } = req.body;

        // Create a new invoice instance
        const newInvoice = new Invoice({ from, to, items, dates, currency, discount, tax });

        // Save the new invoice to the database
        const savedInvoice = await newInvoice.save();

        // Send a success response
        res.status(201).json({ message: 'Invoice created successfully', invoice: savedInvoice });
    } catch (err) {
        // Handle errors
        next(err);
    }
};

export const getAllInvoices = async (req, res, next) => {
    try {
        // Retrieve all invoices from the database
        const invoices = await Invoice.find();

        // Send a success response with the list of invoices
        res.status(200).json(invoices);
    } catch (err) {
        // Handle errors
        next(err);
    }
};

export const getInvoiceById = async (req, res, next) => {
    try {
        // Extract invoice ID from request parameters
        const { id } = req.params;

        // Find the invoice by ID in the database
        const invoice = await Invoice.findById(id);

        // If invoice not found, send a 404 response
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Send a success response with the invoice details
        res.status(200).json(invoice);
    } catch (err) {
        // Handle errors
        next(err);
    }
};

export const updateInvoice = async (req, res, next) => {
    try {
        // Extract invoice ID from request parameters
        const { id } = req.params;

        // Extract updated fields from request body
        const updatedFields = req.body;

        // Find the invoice by ID and update it with the new data
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, updatedFields, { new: true });

        // If invoice not found, send a 404 response
        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Send a success response with the updated invoice details
        res.status(200).json({ message: 'Invoice updated successfully', invoice: updatedInvoice });
    } catch (err) {
        // Handle errors
        next(err);
    }
};

export const deleteInvoice = async (req, res, next) => {
    try {
        // Extract invoice ID from request parameters
        const { id } = req.params;

        // Find the invoice by ID and delete it
        const deletedInvoice = await Invoice.findByIdAndDelete(id);

        // If invoice not found, send a 404 response
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Send a success response
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        // Handle errors
        next(err);
    }
};
