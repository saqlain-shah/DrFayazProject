import express from 'express';
import * as invoiceController from '../controllers/InvoiceController/invoice.js';

const router = express.Router();

router.route('/')
    .post(invoiceController.createInvoice)
    .get(invoiceController.getAllInvoices);

router.route('/:id')
    .get(invoiceController.getInvoiceById)
    .put(invoiceController.updateInvoice)
    .delete(invoiceController.deleteInvoice);

export default router;
