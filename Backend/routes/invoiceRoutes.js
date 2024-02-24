import express from 'express';
import * as invoiceController from '../controllers/InvoiceController/invoice.js';
import * as itemController from '../controllers/InvoiceController/Item.js';

const router = express.Router();

// Routes for invoices
router.route('/invoices')
    .post(invoiceController.createInvoice)
    .get(invoiceController.getAllInvoices);

router.route('/invoices/:id')
    .get(invoiceController.getInvoiceById)
    .put(invoiceController.updateInvoice)
    .delete(invoiceController.deleteInvoice);

// Routes for items
router.route('/items')
    .get(itemController.getAllItems);

router.route('/items/:id')
    .get(itemController.getItemById)
    .put(itemController.updateItem)
    .delete(itemController.deleteItem);

export default router;
