import Payment from '../../models/Payment/paymentModel.js';

export const createPayment = async (req, res, next) => {
    try {
        const { status, user, items, date, dueDate, paidBy, currency, subTotal, discount, tax, grandTotal, notes } = req.body;
        const newPayment = new Payment({ status, user, items, date, dueDate, paidBy, currency, subTotal, discount, tax, grandTotal, notes });
        const savedPayment = await newPayment.save();
        res.status(201).json({ message: 'Payment created successfully', payment: savedPayment });
    } catch (err) {
        next(err);
    }
};

export const getAllPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (err) {
        next(err);
    }
};

export const getPaymentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (err) {
        next(err);
    }
};

export const updatePayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const updatedPayment = await Payment.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
    } catch (err) {
        next(err);
    }
};

export const deletePayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedPayment = await Payment.findByIdAndDelete(id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (err) {
        next(err);
    }
};
