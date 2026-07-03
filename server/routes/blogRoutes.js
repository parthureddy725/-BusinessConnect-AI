const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', verifyToken, isAdmin, blogController.createBlog);
router.put('/:id', verifyToken, isAdmin, blogController.updateBlog);
router.delete('/:id', verifyToken, isAdmin, blogController.deleteBlog);

module.exports = router;
