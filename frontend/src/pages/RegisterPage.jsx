import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, logout, googleLogin, loading, error } = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side password match check
    if (form.password !== form.password2) {
      setFieldErrors({ password2: 'Passwords do not match.' });
      return;
    }

    const result = await register(form);
    if (result.success) {
      logout();
      navigate('/login', {
        replace: true,
        state: { message: 'Account created successfully! Please sign in to enter the website.' },
      });
    } else {
      if (typeof result.errors === 'object') {
        setFieldErrors(result.errors);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', autocomplete: 'username', placeholder: 'yourname' },
    { name: 'email',    label: 'Email',    type: 'email', autocomplete: 'email',    placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', autocomplete: 'new-password', placeholder: '••••••••', isPassword: true, show: showPassword, toggle: () => setShowPassword((p) => !p) },
    { name: 'password2', label: 'Confirm Password', type: 'password', autocomplete: 'new-password', placeholder: '••••••••', isPassword: true, show: showPassword2, toggle: () => setShowPassword2((p) => !p) },
  ];

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
          <p className="text-white/50 mt-2 text-xs sm:text-sm tracking-widest uppercase">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">

          {/* Global error */}
          {error?.detail && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error.detail}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {fields.map(({ name, label, type, autocomplete, placeholder, isPassword, show, toggle }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-white/70 text-xs tracking-widest uppercase mb-2"
                >
                  {label}
                </label>
                <div className={isPassword ? "relative" : ""}>
                  <input
                    id={name}
                    type={isPassword ? (show ? 'text' : 'password') : type}
                    name={name}
                    autoComplete={autocomplete}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    className={`w-full bg-white/5 border ${
                      fieldErrors[name] ? 'border-red-500/60' : 'border-white/10'
                    } rounded-lg ${isPassword ? 'pl-4 pr-12' : 'px-4'} py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/60 transition-colors`}
                    placeholder={placeholder}
                  />
                  {isPassword && (
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors p-1"
                      aria-label={show ? 'Hide password' : 'Show password'}
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
                {fieldErrors[name] && (
                  <p className="mt-1 text-xs text-red-400">
                    {Array.isArray(fieldErrors[name])
                      ? fieldErrors[name][0]
                      : fieldErrors[name]}
                  </p>
                )}
              </div>
            ))}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-charcoal font-semibold py-3 rounded-lg tracking-widest uppercase text-sm hover:bg-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-charcoal/90 px-3 text-xs text-white/40 uppercase tracking-widest">or sign up with</span>
            </div>
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error('Google login failed')}
              useOneTap={false}
              theme="filled_black"
              shape="rectangular"
              size="large"
              text="signup_with"
              width="100%"
            />
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-white/40 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
