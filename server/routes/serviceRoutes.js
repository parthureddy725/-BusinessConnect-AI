const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', serviceController.getAllServices);
router.post('/', verifyToken, isAdmin, serviceController.createService);
router.put('/:id', verifyToken, isAdmin, serviceController.updateService);
router.delete('/:id', verifyToken, isAdmin, serviceController.deleteService);

module.exports = router;
