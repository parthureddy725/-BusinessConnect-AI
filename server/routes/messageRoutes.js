const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, messageController.getAllMessages);
router.post('/', messageController.sendMessage);
router.post('/:id/reply', verifyToken, isAdmin, messageController.replyToMessage);
router.delete('/:id', verifyToken, isAdmin, messageController.deleteMessage);

module.exports = router;
