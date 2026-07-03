const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments.' });
  }
};

exports.createAppointment = async (req, res) => {
  const { clientName, clientEmail, date, timeSlot, budget, requirements } = req.body;
  try {
    const appointment = await Appointment.create({
      clientName,
      clientEmail: clientEmail.toLowerCase(),
      date,
      timeSlot,
      budget,
      requirements
    });

    // Notify client of pending status
    await Notification.create({
      title: 'Consultation Scheduled',
      message: `Your appointment request for ${date} at ${timeSlot} has been received and is pending confirmation.`,
      userEmail: clientEmail.toLowerCase(),
      type: 'appointment'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment.' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body; // 'approved' or 'declined'
  try {
    const original = await Appointment.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Appointment not found.' });

    const updated = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });

    // Notify client of approval/declined update
    await Notification.create({
      title: `Consultation Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your appointment request for ${updated.date} at ${updated.timeSlot} has been ${status}.`,
      userEmail: updated.clientEmail,
      type: 'appointment'
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status.' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Appointment not found.' });
    res.json({ message: 'Appointment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment.' });
  }
};
