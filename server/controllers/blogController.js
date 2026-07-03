const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog posts.' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found.' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog details.' });
  }
};

exports.createBlog = async (req, res) => {
  const { title, content, category, author, image, readTime, tags } = req.body;
  try {
    const blog = await Blog.create({
      title,
      content,
      category,
      author: author || 'BusinessConnect AI Team',
      image: image || '/images/blog-placeholder.jpg',
      readTime: readTime || '5 min read',
      tags: Array.isArray(tags) ? tags : [tags]
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog post.' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Blog post not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post.' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Blog post not found.' });
    res.json({ message: 'Blog post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post.' });
  }
};
