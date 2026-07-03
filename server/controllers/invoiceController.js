const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving invoices.' });
  }
};

exports.getClientInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ clientEmail: req.user.email });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving client invoices.' });
  }
};

exports.createInvoice = async (req, res) => {
  const { clientEmail, projectTitle, amount, dueDate, status, downloadUrl, projectId } = req.body;
  try {
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      clientEmail: clientEmail.toLowerCase(),
      projectTitle,
      amount: Number(amount),
      dueDate,
      status: status || 'unpaid',
      downloadUrl: downloadUrl || '/invoices/invoice-placeholder.pdf'
    });

    // If projectId is provided, associate invoice to project
    if (projectId) {
      const project = await Project.findById(projectId);
      if (project) {
        if (!project.invoices) project.invoices = [];
        project.invoices.push(invoice._id || invoice.id);
        await Project.findByIdAndUpdate(projectId, project);
      }
    }

    // Notify client of new invoice
    await Notification.create({
      title: 'New Invoice Issued',
      message: `Invoice ${invoiceNumber} of amount $${amount} is issued for "${projectTitle}". Due date: ${dueDate}.`,
      userEmail: clientEmail.toLowerCase(),
      type: 'invoice'
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating invoice.' });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
  const { status } = req.body; // 'paid' or 'unpaid'
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });

    const updated = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true });

    // Notify client
    await Notification.create({
      title: 'Invoice Payment Received',
      message: `Invoice ${updated.invoiceNumber} status is now updated to: ${status.toUpperCase()}.`,
      userEmail: updated.clientEmail,
      type: 'invoice'
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice.' });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Invoice not found.' });
    res.json({ message: 'Invoice deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invoice.' });
  }
};
