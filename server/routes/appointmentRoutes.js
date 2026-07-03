const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, appointmentController.getAllAppointments);
router.post('/', appointmentController.createAppointment);
router.put('/:id/status', verifyToken, isAdmin, appointmentController.updateAppointmentStatus);
router.delete('/:id', verifyToken, isAdmin, appointmentController.deleteAppointment);

module.exports = router;
