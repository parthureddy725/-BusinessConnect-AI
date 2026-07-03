const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "I'm sorry, I didn't receive a message." });
  }

  const query = message.toLowerCase().trim();
  let reply = "";

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    reply = "Hello! I am your BusinessConnect AI Assistant. How can I help you establish your digital presence today?";
  } else if (query.includes('service') || query.includes('what do you do') || query.includes('offer')) {
    reply = "We offer a wide range of premium services: \n1. Website Development\n2. Mobile App Development\n3. Digital Marketing & SEO\n4. Branding & UI/UX Design\n5. AI automation & Cloud Solutions. Which area are you interested in?";
  } else if (query.includes('price') || query.includes('pricing') || query.includes('cost')) {
    reply = "Our pricing is flexible and custom-tailored to your project. Standard web projects start around $1,499. You can request a custom proposal or budget outline by clicking on 'Book Consultation' in the navigation bar!";
  } else if (query.includes('appoint') || query.includes('book') || query.includes('schedule') || query.includes('consult')) {
    reply = "You can easily schedule a video consultation! Just head over to our 'Book Consultation' page, select a date, time slot, and specify your budget. We will get back to you with a Zoom link within 24 hours.";
  } else if (query.includes('portfolio') || query.includes('project') || query.includes('work') || query.includes('case study')) {
    reply = "We have completed premium web and app designs across various industries. Check out our 'Portfolio' page to see detailed project categories, live previews, and client testimonials!";
  } else if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('support')) {
    reply = "You can reach us at support@businessconnect.ai or call +1 (555) 019-2834. Alternatively, click the WhatsApp button on the Contact page to start a direct chat with our client support team.";
  } else if (query.includes('track') || query.includes('dashboard') || query.includes('progress') || query.includes('status')) {
    reply = "Already a customer? Log in to your Customer Dashboard or visit the 'Project Tracker' page with your Project ID to monitor the design, development, and testing progress in real time!";
  } else {
    reply = "Thank you for asking! BusinessConnect AI specializes in full-stack engineering, branding, and automation. Could you tell me a bit more about your business needs so I can give you a tailored recommendation?";
  }

  res.json({ reply });
});

module.exports = router;
