const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const Invoice = require('../models/Invoice');

const seedData = async () => {
  try {
    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding default users...');
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      const clientPassword = await bcrypt.hash('client123', salt);

      await User.create({
        name: 'Admin Director',
        email: 'admin@businessconnect.ai',
        password: adminPassword,
        role: 'admin',
        profile: {
          company: 'BusinessConnect AI',
          phone: '+1 (555) 019-2834',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200'
        }
      });

      await User.create({
        name: 'John Doe',
        email: 'client@businessconnect.ai',
        password: clientPassword,
        role: 'client',
        profile: {
          company: 'Acme Corporates',
          phone: '+1 (555) 045-8833',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
        }
      });
      console.log('✅ Users seeded: admin@businessconnect.ai (admin123) & client@businessconnect.ai (client123)');
    }

    // 2. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('🌱 Seeding default services...');
      await Service.create([
        {
          name: 'Website Development',
          description: 'Sleek, responsive web applications engineered with cutting-edge technologies like React, Next.js, and Node.',
          features: ['Custom Frontend Architecture', 'SEO & Speed Optimized', 'Secure Payment Gateway API', 'CMS Integration'],
          pricing: 'Starting at $1,499',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
          category: 'Development'
        },
        {
          name: 'Mobile App Development',
          description: 'Native iOS & Android mobile app development configured for rich interactive experiences and push notifications.',
          features: ['Cross-platform Flutter/React Native', 'App Store Deployment', 'Biometric Lock Integration', 'Real-time sync'],
          pricing: 'Starting at $3,499',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600',
          category: 'Development'
        },
        {
          name: 'UI/UX Brand Design',
          description: 'Figma mockups, interactive high-fidelity user flows, style guides, and complete digital brand identity kits.',
          features: ['Typography & Grid System', 'Responsive Wireframing', 'Interactive Prototypes', 'Asset Exports & Guidelines'],
          pricing: 'Starting at $999',
          image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=600',
          category: 'Branding'
        },
        {
          name: 'AI Automation Agent',
          description: 'Intelligent AI chatbot support systems, autonomous lead generation workflows, and automated email follow-up chains.',
          features: ['OpenAI / Anthropic API wireup', 'Automated email auto-responders', 'Internal CRM sync pipelines', 'Customer Behavior Tracking'],
          pricing: 'Starting at $2,499',
          image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600',
          category: 'AI Solutions'
        }
      ]);
      console.log('✅ Services seeded.');
    }

    // 3. Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      console.log('🌱 Seeding default testimonials...');
      await Testimonial.create([
        {
          clientName: 'Sarah Jenkins',
          role: 'CEO, BrightPath Retailers',
          rating: 5,
          content: 'BusinessConnect AI transformed our local commerce branch into an online powerhouse. The Project Tracker was amazing for keeping tabs on timelines!',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          videoUrl: '',
          approved: true
        },
        {
          clientName: 'Marcus Aurel',
          role: 'Product Lead, TechSphere Inc.',
          rating: 5,
          content: 'The custom React dashboard they delivered was flawless. Speed optimizations are top tier, and their customer support assistant resolved our queries in minutes.',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
          videoUrl: '',
          approved: true
        }
      ]);
      console.log('✅ Testimonials seeded.');
    }

    // 4. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('🌱 Seeding default blogs...');
      await Blog.create([
        {
          title: 'Unlocking Business Scale with AI Automation',
          content: 'In 2026, manual lead routing is a bottleneck. By integrating intelligent AI agents directly into your customer support channels, businesses can cut response delay times by 80% while retaining high-fidelity customer engagement.',
          category: 'AI Solutions',
          author: 'BusinessConnect AI Team',
          image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600',
          readTime: '4 min read',
          tags: ['AI', 'Automation', 'Scalability']
        },
        {
          title: 'Top 5 UX Design Principles for Customer Conversions',
          content: 'A digital storefront should convert visits to engagements. Using modern glassmorphic card designs, clear hierarchy systems, and dynamic scrolling animations can keep viewers hooked and streamline checkout funnels.',
          category: 'Branding',
          author: 'UI/UX Design Lead',
          image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=600',
          readTime: '6 min read',
          tags: ['Design', 'UI/UX', 'Conversions']
        }
      ]);
      console.log('✅ Blogs seeded.');
    }

    // 5. Seed Project & Invoices
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('🌱 Seeding default projects...');
      
      const newProj = await Project.create({
        name: 'E-Commerce Platform Rebrand',
        clientEmail: 'client@businessconnect.ai',
        description: 'Rebuilding client storefront using React, Tailwind CSS, and a Node backend API with advanced stripe checkout elements.',
        stage: 'Development',
        progress: 60,
        estimatedCompletion: 'August 15, 2026',
        timeline: [
          { stage: 'Planning', date: '2026-06-01', completed: true },
          { stage: 'Design', date: '2026-06-15', completed: true },
          { stage: 'Development', date: '2026-07-01', completed: true },
          { stage: 'Testing', date: '', completed: false },
          { stage: 'Completed', date: '', completed: false }
        ],
        documents: [
          { name: 'UI Figma Wireframe PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { name: 'Development Database Architecture diagram', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
        ],
        invoices: []
      });

      console.log('🌱 Seeding default invoices...');
      const invPaid = await Invoice.create({
        invoiceNumber: 'INV-1092-231',
        clientEmail: 'client@businessconnect.ai',
        projectTitle: 'E-Commerce Platform Rebrand - Design Phase',
        amount: 1500,
        dueDate: '2026-06-15',
        status: 'paid',
        downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      });

      const invUnpaid = await Invoice.create({
        invoiceNumber: 'INV-1092-452',
        clientEmail: 'client@businessconnect.ai',
        projectTitle: 'E-Commerce Platform Rebrand - Development Phase',
        amount: 2500,
        dueDate: '2026-08-01',
        status: 'unpaid',
        downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      });

      // Update project links
      newProj.invoices = [invPaid.invoiceNumber, invUnpaid.invoiceNumber];
      
      // Save updated project
      await Project.findByIdAndUpdate(newProj._id || newProj.id, newProj);
      
      console.log('✅ Projects and Invoices seeded.');
    }

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
