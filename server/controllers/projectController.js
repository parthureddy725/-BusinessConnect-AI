const Project = require('../models/Project');
const Notification = require('../models/Notification');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving projects.' });
  }
};

exports.getClientProjects = async (req, res) => {
  try {
    const projects = await Project.find({ clientEmail: req.user.email });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving customer projects.' });
  }
};

exports.trackProjectByEmailAndId = async (req, res) => {
  const { email, projectId } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project || project.clientEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(404).json({ message: 'Project not found with the provided credentials.' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error tracking project.' });
  }
};

exports.createProject = async (req, res) => {
  const { name, clientEmail, description, stage, progress, estimatedCompletion, timeline } = req.body;
  try {
    const defaultTimeline = timeline || [
      { stage: 'Planning', date: new Date().toLocaleDateString(), completed: true },
      { stage: 'Design', date: '', completed: false },
      { stage: 'Development', date: '', completed: false },
      { stage: 'Testing', date: '', completed: false },
      { stage: 'Completed', date: '', completed: false }
    ];

    const project = await Project.create({
      name,
      clientEmail: clientEmail.toLowerCase(),
      description,
      stage: stage || 'Planning',
      progress: progress || 0,
      estimatedCompletion,
      timeline: defaultTimeline,
      documents: [],
      invoices: []
    });

    // Notify client
    await Notification.create({
      title: 'New Project Setup',
      message: `Your project "${name}" has been registered in the system.`,
      userEmail: clientEmail.toLowerCase(),
      type: 'project'
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project.' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const originalProject = await Project.findById(req.params.id);
    if (!originalProject) return res.status(404).json({ message: 'Project not found' });

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // If progress or stage changed, create notification
    if (originalProject.stage !== updated.stage || originalProject.progress !== updated.progress) {
      await Notification.create({
        title: 'Project Status Update',
        message: `Your project "${updated.name}" is now at stage: ${updated.stage} (${updated.progress}% completed).`,
        userEmail: updated.clientEmail,
        type: 'project'
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project.' });
  }
};

exports.addDocument = async (req, res) => {
  const { name, url } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    project.documents.push({ name, url, uploadedAt: new Date() });
    
    // Handle Mongoose / fallback instance save
    const updated = await Project.findByIdAndUpdate(project._id || project.id, project, { new: true });

    await Notification.create({
      title: 'New Document Uploaded',
      message: `A new document "${name}" has been uploaded to project "${project.name}".`,
      userEmail: project.clientEmail,
      type: 'project'
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error adding document.' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project.' });
  }
};
