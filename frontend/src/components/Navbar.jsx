import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, LogIn, LogOut, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements.length) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      firstElement.focus();
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const handleLogoClick = (e) => {
    setMenuOpen(false);
    if (window.location.pathname === '/' || window.location.pathname === '') {
      e.preventDefault();
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${scrolled ? 'bg-charcoal/80 backdrop-blur-md border-white/10 py-3 sm:py-4' : 'bg-transparent py-4 sm:py-6'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center">
          {/* Logo (linked to Hero section & smooth scroll to top) */}
          <Link
            to="/#hero"
            onClick={handleLogoClick}
            className="flex justify-center items-center gap-1.5 sm:gap-2 group cursor-pointer"
            aria-label="Godavari Vindu Home"
          >
            <img
              className="w-12 sm:w-15 md:w-17 transition-transform duration-300 group-hover:scale-105"
              src="/images/Godavari logo.png"
              alt="Godavari Vindu Logo"
            />
            <span className="text-base sm:text-xl md:text-2xl font-heading font-bold text-gold tracking-wider sm:tracking-widest uppercase group-hover:text-yellow-300 transition-colors">
              Godavari Vindu
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-8 text-sm tracking-widest text-white/80 font-medium items-center">
            <a href="/#menu" className="hover:text-gold transition-colors">Menu</a>
            <a href="/#chef" className="hover:text-gold transition-colors">Chef</a>
            <a href="/#gallery" className="hover:text-gold transition-colors">Gallery</a>
            <a href="/#reservation" className="hover:text-gold transition-colors">Reservation</a>

            {/* Cart */}
            <button
              onClick={onCartClick}
              aria-label="Open cart"
              className="relative p-2 text-white/80 hover:text-gold transition-all"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-charcoal text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth — desktop */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-label="Account menu"
                  className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-7 h-7 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="text-xs tracking-widest">{user?.username}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-44 bg-charcoal border border-white/10 rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white/50 text-xs truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors"
              >
                <LogIn size={18} />
                <span className="text-xs tracking-widest uppercase">Sign in</span>
              </Link>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={onCartClick}
              aria-label="Open cart"
              className="relative p-2 text-white/80 hover:text-gold transition-all"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-charcoal text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="text-white/80 hover:text-gold"
              onClick={() => setMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.5 }}
            className="fixed inset-0 z-60 bg-charcoal flex flex-col items-center justify-center"
            ref={menuRef}
          >
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-gold"
              onClick={() => setMenuOpen(false)}
              aria-label="Close mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col space-y-8 text-2xl font-heading text-center">
              <a href="/#hero" onClick={handleLogoClick} className="hover:text-gold transition-colors">Home</a>
              <a href="/#menu" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">Menu</a>
              <a href="/#chef" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">Chef</a>
              <a href="/#gallery" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">Gallery</a>
              <a href="/#reservation" onClick={() => setMenuOpen(false)} className="hover:text-gold transition-colors">Reservation</a>

              {/* Auth — mobile */}
              {isLoggedIn ? (
                <>
                  <span className="text-white/40 text-sm tracking-widest">{user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 text-white/80 hover:text-gold transition-colors"
                  >
                    <LogOut size={20} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 hover:text-gold transition-colors"
                  >
                    <LogIn size={20} />
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-gold hover:text-gold/80 transition-colors"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
