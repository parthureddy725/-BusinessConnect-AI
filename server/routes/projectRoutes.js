const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, projectController.getAllProjects);
router.get('/client', verifyToken, projectController.getClientProjects);
router.post('/track', projectController.trackProjectByEmailAndId);
router.post('/', verifyToken, isAdmin, projectController.createProject);
router.put('/:id', verifyToken, isAdmin, projectController.updateProject);
router.post('/:id/document', verifyToken, isAdmin, projectController.addDocument);
router.delete('/:id', verifyToken, isAdmin, projectController.deleteProject);

module.exports = router;
