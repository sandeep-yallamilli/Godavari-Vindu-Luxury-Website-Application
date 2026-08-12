import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Success() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-12 rounded-3xl text-center max-w-md w-full gold-glow"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-gold" />
        </div>
        <h1 className="text-4xl font-heading text-white mb-4">Payment Successful!</h1>
        <p className="text-white/60 font-body mb-8">
          Thank you for your order. We are preparing your delicious meal and will notify you soon.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-3 rounded-full font-heading text-lg hover:scale-105 transition-transform"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
