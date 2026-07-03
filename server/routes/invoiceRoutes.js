const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, invoiceController.getAllInvoices);
router.get('/client', verifyToken, invoiceController.getClientInvoices);
router.post('/', verifyToken, isAdmin, invoiceController.createInvoice);
router.put('/:id/status', verifyToken, isAdmin, invoiceController.updateInvoiceStatus);
router.delete('/:id', verifyToken, isAdmin, invoiceController.deleteInvoice);

module.exports = router;
