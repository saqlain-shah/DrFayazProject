import express from 'express';
import * as paymentController from '../controllers/Payment/payment.js';

const router = express.Router();

router.route('/')
    .post(paymentController.createPayment)
    .get(paymentController.getAllPayments);

router.route('/:id')
    .get(paymentController.getPaymentById)
    .put(paymentController.updatePayment)
    .delete(paymentController.deletePayment);

export default router;
