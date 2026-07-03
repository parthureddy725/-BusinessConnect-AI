const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving services.' });
  }
};

exports.createService = async (req, res) => {
  const { name, description, features, pricing, image, category } = req.body;
  try {
    const service = await Service.create({
      name,
      description,
      features: Array.isArray(features) ? features : [features],
      pricing,
      image: image || '/images/placeholder.jpg',
      category: category || 'Development'
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service.' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Service not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service.' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Service not found.' });
    res.json({ message: 'Service deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service.' });
  }
};
