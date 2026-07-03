const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile/update', verifyToken, authController.updateProfile);

// Admin-only user management
router.get('/users', verifyToken, isAdmin, authController.getUsers);
router.delete('/users/:id', verifyToken, isAdmin, authController.deleteUser);

module.exports = router;
