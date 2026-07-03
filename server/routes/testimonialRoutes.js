const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', testimonialController.getAllTestimonials);
router.get('/admin', verifyToken, isAdmin, testimonialController.getAdminTestimonials);
router.post('/', testimonialController.createTestimonial);
router.put('/:id/approve', verifyToken, isAdmin, testimonialController.updateTestimonialApproval);
router.delete('/:id', verifyToken, isAdmin, testimonialController.deleteTestimonial);

module.exports = router;
