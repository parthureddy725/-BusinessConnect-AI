const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, notificationController.getClientNotifications);
router.put('/:id/read', verifyToken, notificationController.markAsRead);
router.delete('/', verifyToken, notificationController.clearNotifications);

module.exports = router;
