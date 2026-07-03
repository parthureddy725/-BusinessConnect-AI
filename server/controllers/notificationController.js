const Notification = require('../models/Notification');

exports.getClientNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userEmail: req.user.email });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notifications.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Notification not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read.' });
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userEmail: req.user.email });
    res.json({ message: 'Notifications cleared successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing notifications.' });
  }
};
