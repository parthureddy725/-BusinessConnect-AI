import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { Calendar as CalendarIcon, Clock, DollarSign, ListTodo, CheckCircle2, ArrowRight } from 'lucide-react';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const Consultation = () => {
  const location = useLocation();
  const { showToast } = useUI();

  // Selected service passed from services details click
  const preSelected = location.state?.preSelectedService || '';

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [budget, setBudget] = useState('Under $5,000');
  const [requirements, setRequirements] = useState(preSelected ? `I am interested in Booking: ${preSelected}. ` : '');
  
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  // Time slots database
  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM'
  ];

  // Budget list
  const budgets = [
    'Under $5,000',
    '$5,000 - $10,000',
    '$10,000 - $20,000',
    '$20,000+'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!timeSlot) {
      showToast('Please select a preferred time slot.', 'warning');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        clientName,
        clientEmail,
        date,
        timeSlot,
        budget,
        requirements
      };
      
      const res = await axios.post('/appointments', payload);
      setSuccessDetails(res.data);
      setIsSuccess(true);
      showToast('Consultation request submitted!');
      
      // Clear form
      setClientName('');
      setClientEmail('');
      setDate('');
      setTimeSlot('');
      setBudget('Under $5,000');
      setRequirements('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error scheduling appointment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-6 w-full animate-fade-in">
        
        {!isSuccess ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Info panel */}
            <div className="lg:col-span-4 flex flex-col justify-between py-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Book Consultation</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-3 leading-relaxed">
                  Book a direct 30-minute discovery video consultation with our solutions architects. We will explore your requirements and draft a wireframe scope.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">✔</span>
                  <span>Free database architecture mapping</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">✔</span>
                  <span>Scope document delivery in 24 hours</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">✔</span>
                  <span>Flexible payment plan configurations</span>
                </div>
              </div>
            </div>

            {/* Form panel */}
            <GlassCard className="lg:col-span-8 p-6 md:p-8 bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Name / Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                    <input
                      type="email"
                      placeholder="client@company.com"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>
                </div>

                {/* Calendar Date picker / Budget row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <CalendarIcon size={14} /> Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]} // Block past dates
                      className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <DollarSign size={14} /> Project Budget
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 font-medium cursor-pointer"
                    >
                      {budgets.map((b) => (
                        <option key={b} value={b} className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time slot picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={14} /> Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`p-3 rounded-xl border text-center text-[11px] font-semibold transition-all duration-300 ${
                          timeSlot === slot
                            ? 'bg-gradient-to-r from-primary-600 to-secondary-500 border-transparent text-white shadow-md'
                            : 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Requirements description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <ListTodo size={14} /> Project Requirements & Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about pages needed, styling goals, or features like chat bots, integrations, etc..."
                    required
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 font-medium resize-none"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-xs mt-3"
                >
                  {loading ? 'Submitting Appointment...' : 'Submit Request'}
                  <ArrowRight size={14} />
                </button>

              </form>
            </GlassCard>

          </div>
        ) : (
          /* Booking Success confirmation view */
          <div className="max-w-lg mx-auto text-center">
            <GlassCard className="p-8 border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/40 shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                <CheckCircle2 size={36} className="animate-bounce" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Consultation Scheduled!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Thank you, {successDetails?.clientName}. Your discovery call appointment request is confirmed in pending stage. Our team will review the requirements and send a calendar invite.
              </p>

              {/* Booked details summary */}
              <div className="w-full mt-6 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-850/50 border border-slate-200/40 dark:border-slate-700/30 text-left text-xs flex flex-col gap-2">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Date & Time Slot</span>
                  <span className="font-bold text-slate-800 dark:text-white mt-0.5 block">{successDetails?.date} at {successDetails?.timeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Project Budget range</span>
                  <span className="font-bold text-slate-800 dark:text-white mt-0.5 block">{successDetails?.budget}</span>
                </div>
              </div>

              <button
                onClick={() => setIsSuccess(false)}
                className="btn-secondary w-full py-2.5 text-xs mt-6"
              >
                Schedule Another Call
              </button>
            </GlassCard>
          </div>
        )}

      </div>
    </div>
  );
};

export default Consultation;
