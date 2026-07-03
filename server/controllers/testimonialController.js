const Testimonial = require('../models/Testimonial');

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving testimonials.' });
  }
};

exports.getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving testimonials.' });
  }
};

exports.createTestimonial = async (req, res) => {
  const { clientName, role, rating, content, image, videoUrl } = req.body;
  try {
    const testimonial = await Testimonial.create({
      clientName,
      role,
      rating: Number(rating) || 5,
      content,
      image: image || '/images/avatar-placeholder.png',
      videoUrl: videoUrl || '',
      approved: true // Default auto-approve in dashboard, configurable by admin
    });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting testimonial.' });
  }
};

exports.updateTestimonialApproval = async (req, res) => {
  const { approved } = req.body;
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, { approved }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Testimonial not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating testimonial approval.' });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Testimonial not found.' });
    res.json({ message: 'Testimonial deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial.' });
  }
};
