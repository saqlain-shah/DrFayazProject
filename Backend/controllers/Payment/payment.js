import Payment from '../../models/Payment/paymentModel.js';

import Stripe from 'stripe';

const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY');

export const createPayment = async (req, res, next) => {
    try {
        // Extract payment details from request body
        const { amount, currency, description, source } = req.body;

        // Create a payment intent using Stripe API
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            description,
            payment_method: source, // Payment source (e.g., card token)
            confirm: true, // Confirm the payment immediately
        });

        // If payment intent is successful, save payment details to your database
        if (paymentIntent.status === 'succeeded') {
            const { status, user, items, dueDate, paidBy, subTotal, discount, tax, grandTotal, notes } = req.body;
            const newPayment = new Payment({ status, user, items, dueDate, paidBy, currency, subTotal, discount, tax, grandTotal, notes });
            await newPayment.save();

            // Handle successful payment
            res.status(200).json({ message: 'Payment successful' });
        } else {
            // Handle failed payment intent
            res.status(400).json({ error: 'Payment failed' });
        }
    } catch (error) {
        // Handle errors
        next(error);
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
