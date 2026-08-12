import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitReservation } from '../services/api';
import { useSite } from '../context/SiteContext';

export default function Reservation() {
  const { getAssetUrl } = useSite();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await submitReservation(formData);
      if (response.status === 201) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="reservation" className="py-16 sm:py-24 md:py-32 relative flex items-center justify-center min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={getAssetUrl('reservation_bg', '/images/hero_bg.png')} alt="Background" className="w-full h-full object-cover opacity-20 filter blur-sm" />
        <div className="absolute inset-0 bg-charcoal/80" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl">
        <div className="glass-panel p-6 sm:p-10 md:p-16 rounded-2xl sm:rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-transparent via-gold to-transparent opacity-50" />

          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-white mb-2 sm:mb-4">Book a Table</h2>
            <p className="text-white/60 font-body text-sm sm:text-base">Reserve your exclusive dining experience.</p>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6 text-gold">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-3xl font-heading text-white mb-2">Reservation Confirmed</h3>
              <p className="text-white/70">We look forward to hosting you, {formData.name}.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 text-gold uppercase tracking-widest text-sm hover:text-white transition-colors"
              >
                Make another booking
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-body text-white/70 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-gold transition-colors font-body"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-body text-white/70 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-gold transition-colors font-body"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-body text-white/70 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-gold transition-colors font-body scheme-dark"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-body text-white/70 uppercase tracking-wider">Time</label>
                  <input
                    type="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-gold transition-colors font-body scheme-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-body text-white/70 uppercase tracking-wider">Guests</label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-gold transition-colors font-body appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num} className="bg-charcoal text-white">{num} Person{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {status === 'error' && (
                <div className="col-span-full text-red-500 text-sm">Failed to submit reservation. Please try again.</div>
              )}

              <div className="col-span-full mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-12 py-4 bg-gold text-charcoal font-body font-medium tracking-widest uppercase hover:bg-white transition-all duration-300 disabled:opacity-50"
                >
                  {status === 'loading' ? 'Confirming...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
