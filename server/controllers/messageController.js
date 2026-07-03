const Message = require('../models/Message');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages.' });
  }
};

exports.sendMessage = async (req, res) => {
  const { senderName, senderEmail, content } = req.body;
  try {
    const message = await Message.create({
      senderName,
      senderEmail: senderEmail.toLowerCase(),
      content
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message.' });
  }
};

exports.replyToMessage = async (req, res) => {
  const { reply } = req.body;
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found.' });

    message.reply = reply;
    message.read = true;
    
    // Support Mongoose / fallback instance save
    const updated = await Message.findByIdAndUpdate(message._id || message.id, message, { new: true });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error replying to message.' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Message not found.' });
    res.json({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message.' });
  }
};
