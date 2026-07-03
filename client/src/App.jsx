import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingChat from './components/FloatingChat';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Consultation from './pages/Consultation';
import Tracker from './pages/Tracker';
import Dashboard from './pages/Dashboard';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UIProvider>
          <Router>
            <div className="flex flex-col min-h-screen transition-colors duration-300 dark:bg-slate-950 dark:text-white">
              {/* Navigation Header */}
              <Navbar />

              {/* Page Content area */}
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/consultation" element={<Consultation />} />
                  <Route path="/tracker" element={<Tracker />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>

              {/* AI Assistant Chat widget */}
              <FloatingChat />

              {/* Footer */}
              <Footer />
            </div>
          </Router>
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
