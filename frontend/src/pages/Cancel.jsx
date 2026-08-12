import { XCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-12 rounded-3xl text-center max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <XCircle size={80} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-heading text-white mb-4">Payment Cancelled</h1>
        <p className="text-white/60 font-body mb-8">
          Your payment was not processed. If you had any issues, please try again or contact us.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-full font-heading text-lg hover:bg-white/20 transition-all"
        >
          <Home size={20} />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
