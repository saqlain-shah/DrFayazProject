import express from 'express';
import * as invoiceController from '../controllers/InvoiceController/invoice.js'

const router = express.Router();

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.get('/patient/:patientId', invoiceController.getInvoicesByPatientId);

export default router;
