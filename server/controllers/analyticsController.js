const User = require('../models/User');
const Project = require('../models/Project');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const Testimonial = require('../models/Testimonial');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Gather totals
    const totalUsers = await User.countDocuments({ role: 'client' });
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ stage: { $ne: 'Completed' } });
    const newAppointments = await Appointment.countDocuments({ status: 'pending' });

    // 2. Calculate Revenue (Sum of all paid invoices)
    const paidInvoices = await Invoice.find({ status: 'paid' });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

    // 3. Customer Satisfaction Average Rating
    const testimonials = await Testimonial.find({ approved: true });
    const avgRating = testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : '5.0';

    // 4. Generate mock monthly growth & sales datasets for frontend dashboard charts
    const monthlyRevenue = [
      { month: 'Jan', amount: Math.floor(totalRevenue * 0.1) || 5000 },
      { month: 'Feb', amount: Math.floor(totalRevenue * 0.15) || 8000 },
      { month: 'Mar', amount: Math.floor(totalRevenue * 0.12) || 7500 },
      { month: 'Apr', amount: Math.floor(totalRevenue * 0.18) || 12000 },
      { month: 'May', amount: Math.floor(totalRevenue * 0.2) || 14000 },
      { month: 'Jun', amount: Math.floor(totalRevenue * 0.25) || 19000 }
    ];

    const projectCompletionStats = [
      { name: 'Planning', count: await Project.countDocuments({ stage: 'Planning' }) },
      { name: 'Design', count: await Project.countDocuments({ stage: 'Design' }) },
      { name: 'Development', count: await Project.countDocuments({ stage: 'Development' }) },
      { name: 'Testing', count: await Project.countDocuments({ stage: 'Testing' }) },
      { name: 'Completed', count: await Project.countDocuments({ stage: 'Completed' }) }
    ];

    res.json({
      metrics: {
        totalUsers,
        totalProjects,
        activeProjects,
        newAppointments,
        revenue: totalRevenue,
        monthlyGrowth: '18.4%', // Mocked indicator based on growth
        customerSatisfaction: avgRating
      },
      charts: {
        monthlyRevenue,
        projectCompletionStats
      }
    });
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    res.status(500).json({ message: 'Error generating analytics metrics.' });
  }
};
