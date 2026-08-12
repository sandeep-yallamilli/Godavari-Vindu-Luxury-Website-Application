import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10 pt-12 sm:pt-20 pb-8 sm:pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 sm:mb-16 text-center sm:text-left">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-heading text-gold mb-6 uppercase tracking-widest">Godavari Vindu</h3>
            <p className="text-white/60 font-body text-sm leading-relaxed mb-6">
              A cinematic culinary journey where tradition meets modern luxury. Experience dining elevated to an art form.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-white/40 hover:text-gold transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-gold transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-gold transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-heading text-lg mb-6 tracking-wider uppercase">Contact</h4>
            <p className="text-white/60 font-body text-sm mb-2">123 Culinary Avenue</p>
            <p className="text-white/60 font-body text-sm mb-2">New York, NY 10001</p>
            <p className="text-white/60 font-body text-sm mb-2">+1 (555) 123-4567</p>
            <p className="text-gold font-body text-sm mt-4">reservations@godavarivindu.com</p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-heading text-lg mb-6 tracking-wider uppercase">Hours</h4>
            <div className="flex justify-between w-full max-w-50 mb-2">
              <span className="text-white/60 font-body text-sm">Mon - Thu</span>
              <span className="text-white font-body text-sm">17:00 - 22:30</span>
            </div>
            <div className="flex justify-between w-full max-w-50 mb-2">
              <span className="text-white/60 font-body text-sm">Fri - Sat</span>
              <span className="text-white font-body text-sm">17:00 - 23:30</span>
            </div>
            <div className="flex justify-between w-full max-w-50">
              <span className="text-white/60 font-body text-sm">Sunday</span>
              <span className="text-white font-body text-sm">16:00 - 21:00</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-heading text-lg mb-6 tracking-wider uppercase">Newsletter</h4>
            <p className="text-white/60 font-body text-sm mb-6 leading-relaxed">
              Subscribe for exclusive event invitations and seasonal menu previews.
            </p>
            <form className="w-full relative">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm text-white focus:outline-none focus:border-gold transition-colors font-body"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-gold text-charcoal p-2 rounded-full hover:bg-white transition-colors"
              >
                <Mail size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 font-body">
          <p>&copy; {new Date().getFullYear()} Godavari Vindu. All rights reserved.</p>
          <p>Designed by Sandeep Yallamilli ❤️</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
