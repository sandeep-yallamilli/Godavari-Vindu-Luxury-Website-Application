import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin, loading, error } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      // Map DRF field errors to local state
      if (typeof result.errors === 'object') {
        setFieldErrors(result.errors);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
          <Link to="/" className="flex items-center justify-center gap-2 sm:gap-3 group">
            <img src="/images/Godavari logo.png" alt="Godavari Vindu Logo" className="w-12 sm:w-16 h-12 sm:h-16 object-contain group-hover:scale-105 transition-transform drop-shadow-md" />
            <span className="text-2xl sm:text-3xl font-heading font-bold text-gold tracking-widest uppercase">
              Godavari Vindu
            </span>
          </Link>
          <p className="text-white/50 mt-2 text-xs sm:text-sm tracking-widest uppercase">Welcome back</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">

          {location.state?.message && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm">
              {location.state.message}
            </div>
          )}

          {/* Global error */}
          {error?.detail && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error.detail}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white/70 text-xs tracking-widest uppercase mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full bg-white/5 border ${fieldErrors.email ? 'border-red-500/60' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-white/70 text-xs tracking-widest uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`w-full bg-white/5 border ${fieldErrors.password ? 'border-red-500/60' : 'border-white/10'} rounded-lg pl-4 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-charcoal font-semibold py-3 rounded-lg tracking-widest uppercase text-sm hover:bg-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-charcoal/90 px-3 text-xs text-white/40 uppercase tracking-widest">or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error('Google login failed')}
              useOneTap={false}
              theme="filled_black"
              shape="rectangular"
              size="large"
              text="signin_with"
              width="100%"
            />
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-white/40 text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-gold hover:text-gold/80 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
