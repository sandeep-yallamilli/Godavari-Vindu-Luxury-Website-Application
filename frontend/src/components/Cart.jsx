import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, X, Minus, Plus, CreditCard, MessageCircle, Smartphone, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/api';

// ── Restaurant WhatsApp number (from env or fallback) ──
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '+919963278455').replace('+', '');

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const getImageUrl = (url) => {
  if (!url) return '/images/dish_1.png';
  if (url.startsWith('http')) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
  return `${baseUrl}${url}`;
};

// ── SVG Brand Icons ──────────────────────────────────────────────────────────

const GooglePayIcon = () => (

  <svg width="30" height="30" viewBox="0 0 48 48">
    <path fill="#e64a19" d="M42.858,11.975c-4.546-2.624-10.359-1.065-12.985,3.481L23.25,26.927	c-1.916,3.312,0.551,4.47,3.301,6.119l6.372,3.678c2.158,1.245,4.914,0.506,6.158-1.649l6.807-11.789	C48.176,19.325,46.819,14.262,42.858,11.975z"></path>
    <path fill="#fbc02d" d="M35.365,16.723l-6.372-3.678c-3.517-1.953-5.509-2.082-6.954,0.214l-9.398,16.275	c-2.624,4.543-1.062,10.353,3.481,12.971c3.961,2.287,9.024,0.93,11.311-3.031l9.578-16.59	C38.261,20.727,37.523,17.968,35.365,16.723z"></path>
    <path fill="#43a047" d="M36.591,8.356l-4.476-2.585c-4.95-2.857-11.28-1.163-14.137,3.787L9.457,24.317	c-1.259,2.177-0.511,4.964,1.666,6.22l5.012,2.894c2.475,1.43,5.639,0.582,7.069-1.894l9.735-16.86	c2.017-3.492,6.481-4.689,9.974-2.672L36.591,8.356z"></path>
    <path fill="#1e88e5" d="M19.189,13.781l-4.838-2.787c-2.158-1.242-4.914-0.506-6.158,1.646l-5.804,10.03	c-2.857,4.936-1.163,11.252,3.787,14.101l3.683,2.121l4.467,2.573l1.939,1.115c-3.442-2.304-4.535-6.92-2.43-10.555l1.503-2.596	l5.504-9.51C22.083,17.774,21.344,15.023,19.189,13.781z"></path>
  </svg>
);

const PhonePeIcon = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
    <circle cx="16" cy="16" r="16" fill="#5F259F" />
    <path d="M12.5 7.5L16 11H13.2L9.7 7.5H12.5Z" fill="#FFFFFF" />
    <path d="M8 10H24V12.5H8V10Z" fill="#FFFFFF" />
    <path d="M11 11.5H13.5V16C13.5 17 14.2 17.8 15.2 17.8H17.5V11.5H20V24.5H17.5V20H15.2C12.9 20 11 18.1 11 15.8V11.5Z" fill="#FFFFFF" />
  </svg>
);

const PaytmIcon = () => (
  <svg width="35" height="35" viewBox="0 0 48 48">
    <path fill="#0d47a1" d="M5.446 18.01H.548c-.277 0-.502.167-.503.502L0 30.519c-.001.3.196.45.465.45.735 0 1.335 0 2.07 0C2.79 30.969 3 30.844 3 30.594 3 29.483 3 28.111 3 27l2.126.009c1.399-.092 2.335-.742 2.725-2.052.117-.393.14-.733.14-1.137l.11-2.862C7.999 18.946 6.949 18.181 5.446 18.01zM4.995 23.465C4.995 23.759 4.754 24 4.461 24H3v-3h1.461c.293 0 .534.24.534.535V23.465zM13.938 18h-3.423c-.26 0-.483.08-.483.351 0 .706 0 1.495 0 2.201C10.06 20.846 10.263 21 10.552 21h2.855c.594 0 .532.972 0 1H11.84C10.101 22 9 23.562 9 25.137c0 .42.005 1.406 0 1.863-.008.651-.014 1.311.112 1.899C9.336 29.939 10.235 31 11.597 31h4.228c.541 0 1.173-.474 1.173-1.101v-8.274C17.026 19.443 15.942 18.117 13.938 18zM14 27.55c0 .248-.202.45-.448.45h-1.105C12.201 28 12 27.798 12 27.55v-2.101C12 25.202 12.201 25 12.447 25h1.105C13.798 25 14 25.202 14 25.449V27.55zM18 18.594v5.608c.124 1.6 1.608 2.798 3.171 2.798h1.414c.597 0 .561.969 0 .969H19.49c-.339 0-.462.177-.462.476v2.152c0 .226.183.396.422.396h2.959c2.416 0 3.592-1.159 3.591-3.757v-8.84c0-.276-.175-.383-.342-.383h-2.302c-.224 0-.355.243-.355.422v5.218c0 .199-.111.316-.29.316H21.41c-.264 0-.409-.143-.409-.396v-5.058C21 18.218 20.88 18 20.552 18c-.778 0-1.442 0-2.22 0C18.067 18 18 18.263 18 18.594L18 18.594z"></path><path fill="#00adee" d="M27.038 20.569v-2.138c0-.237.194-.431.43-.431H28c1.368-.285 1.851-.62 2.688-1.522.514-.557.966-.704 1.298-.113L32 18h1.569C33.807 18 34 18.194 34 18.431v2.138C34 20.805 33.806 21 33.569 21H32v9.569C32 30.807 31.806 31 31.57 31h-2.14C29.193 31 29 30.807 29 30.569V21h-1.531C27.234 21 27.038 20.806 27.038 20.569L27.038 20.569zM42.991 30.465c0 .294-.244.535-.539.535h-1.91c-.297 0-.54-.241-.54-.535v-6.623-1.871c0-1.284-2.002-1.284-2.002 0v8.494C38 30.759 37.758 31 37.461 31H35.54C35.243 31 35 30.759 35 30.465V18.537C35 18.241 35.243 18 35.54 18h1.976c.297 0 .539.241.539.537v.292c1.32-1.266 3.302-.973 4.416.228 2.097-2.405 5.69-.262 5.523 2.375 0 2.916-.026 6.093-.026 9.033 0 .294-.244.535-.538.535h-1.891C45.242 31 45 30.759 45 30.465c0-2.786 0-5.701 0-8.44 0-1.307-2-1.37-2 0v8.44H42.991z"></path>
  </svg>
);

const UPIIcon = () => (
  <svg viewBox="0 0 56 20" width="38" height="18" className="object-contain">
    <path d="M3.5 2.5h3.8l-1.9 10.1c-.3 1.4.4 2.5 2 2.5 1.6 0 2.8-1.1 3.1-2.5L12.4 2.5h3.8l-2 10.4c-.7 3.4-3.8 5.7-7.9 5.7-4 0-6.5-2.3-5.7-5.7L3.5 2.5z" fill="#52525B" />
    <path d="M16.8 2.5h7.4c3.1 0 5 1.6 4.4 4.7-.6 3.1-3.2 4.9-6.4 4.9h-3.2l-1.3 6.5h-3.8L16.8 2.5zm5.9 6.5c1.4 0 2.5-.7 2.8-2 .3-1.2-.4-2-1.9-2h-3.3l-.9 4h3.3z" fill="#52525B" />
    <path d="M27.3 2.5h3.8l-3 16.1h-3.8l3-16.1z" fill="#52525B" />
    <path d="M39 2.5l-2.9 16.1h4l2.9-16.1H39z" fill="#ED752E" />
    <path d="M44.5 2.5l-2.9 16.1h4l2.9-16.1h-4z" fill="#097939" />
  </svg>
);

const CardIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="3" />
    <line x1="1" y1="10" x2="23" y2="10" />
    <line x1="5" y1="15" x2="10" y2="15" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="25" height="25" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 13.81 2.49 15.5 3.34 16.97L2.05 21.71L6.92 20.44C8.36 21.24 10.12 21.7 12 21.7C17.52 21.7 22 17.22 22 11.7C22 6.18 17.52 2 12 2Z" fill="#25D366" />
    <path d="M17.47 14.38C17.17 14.23 15.71 13.51 15.44 13.41C15.17 13.31 14.97 13.26 14.77 13.56C14.57 13.86 14 14.53 13.83 14.73C13.66 14.93 13.49 14.95 13.19 14.8C12.89 14.65 11.93 14.34 10.79 13.33C9.91 12.54 9.31 11.57 9.14 11.27C8.97 10.97 9.12 10.81 9.27 10.66C9.4 10.53 9.57 10.32 9.71 10.15C9.86 9.98 9.91 9.85 10.01 9.65C10.11 9.45 10.06 9.28 9.99 9.13C9.91 8.98 9.31 7.52 9.07 6.93C8.83 6.35 8.58 6.43 8.4 6.42C8.23 6.41 8.03 6.41 7.83 6.41C7.63 6.41 7.31 6.48 7.04 6.78C6.77 7.08 6 7.8 6 9.26C6 10.72 7.06 12.13 7.21 12.33C7.36 12.53 9.31 15.53 12.29 16.82C13 17.13 13.55 17.31 13.98 17.45C14.69 17.68 15.34 17.65 15.85 17.57C16.42 17.48 17.61 16.85 17.86 16.15C18.11 15.45 18.11 14.86 18.03 14.73C17.96 14.61 17.77 14.53 17.47 14.38Z" fill="#FFFFFF" />
  </svg>
);

// ── Payment Methods Config ──────────────────────────────────────────────────

const PAYMENT_METHODS = [
  {
    id: 'gpay',
    name: 'Google Pay',
    subtitle: 'UPI · Instant',
    icon: GooglePayIcon,
    brandColor: '#4285F4',
    brandBg: 'rgba(66, 133, 244, 0.12)',
    borderActive: 'border-[#4285F4]',
    shadowActive: 'shadow-[0_0_16px_rgba(66,133,244,0.25)]',
    type: 'razorpay',
    razorpayMethod: 'upi',
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    subtitle: 'UPI · Instant',
    icon: PhonePeIcon,
    brandColor: '#5F259F',
    brandBg: 'rgba(95, 37, 159, 0.12)',
    borderActive: 'border-[#5F259F]',
    shadowActive: 'shadow-[0_0_16px_rgba(95,37,159,0.25)]',
    type: 'razorpay',
    razorpayMethod: 'upi',
  },
  {
    id: 'paytm',
    name: 'Paytm',
    subtitle: 'UPI · Wallet',
    icon: PaytmIcon,
    brandColor: '#00BAF2',
    brandBg: 'rgba(0, 186, 242, 0.12)',
    borderActive: 'border-[#00BAF2]',
    shadowActive: 'shadow-[0_0_16px_rgba(0,186,242,0.25)]',
    type: 'razorpay',
    razorpayMethod: 'upi',
  },
  {
    id: 'upi',
    name: 'UPI',
    subtitle: 'BHIM · Any App',
    icon: UPIIcon,
    brandColor: '#097939',
    brandBg: 'rgba(9, 121, 57, 0.12)',
    borderActive: 'border-[#097939]',
    shadowActive: 'shadow-[0_0_16px_rgba(9,121,57,0.25)]',
    type: 'razorpay',
    razorpayMethod: 'upi',
  },
  {
    id: 'card',
    name: 'Card',
    subtitle: 'Credit · Debit',
    icon: CardIcon,
    brandColor: '#D4AF37',
    brandBg: 'rgba(212, 175, 55, 0.12)',
    borderActive: 'border-gold',
    shadowActive: 'shadow-[0_0_16px_rgba(212,175,55,0.25)]',
    type: 'razorpay',
    razorpayMethod: 'card',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    subtitle: 'Order · Chat',
    icon: WhatsAppIcon,
    brandColor: '#25D366',
    brandBg: 'rgba(37, 211, 102, 0.12)',
    borderActive: 'border-[#25D366]',
    shadowActive: 'shadow-[0_0_16px_rgba(37,211,102,0.25)]',
    type: 'whatsapp',
  },
];

// ── WhatsApp Order Message Builder ──────────────────────────────────────────

function buildWhatsAppMessage(cart, customerInfo, totalPrice) {
  const divider = '─'.repeat(28);
  let msg = `🍽️ *GODAVARI VINDU — New Order*\n`;
  msg += `${divider}\n\n`;
  msg += `👤 *Customer:* ${customerInfo.full_name}\n`;
  msg += `📧 *Email:* ${customerInfo.email}\n`;
  msg += `📱 *Phone:* ${customerInfo.phone}\n\n`;
  msg += `${divider}\n`;
  msg += `🛒 *ORDER DETAILS:*\n${divider}\n\n`;

  cart.forEach((item, idx) => {
    const itemTotal = (Number(item.price) * item.quantity).toFixed(2);
    msg += `${idx + 1}. *${item.name}*`;
    if (item.portion) msg += ` (${item.portion})`;
    msg += `\n`;
    msg += `   Qty: ${item.quantity} × ₹${Number(item.price).toFixed(2)} = *₹${itemTotal}*\n\n`;
  });

  msg += `${divider}\n`;
  msg += `💰 *TOTAL: ₹${totalPrice.toFixed(2)}*\n`;
  msg += `${divider}\n\n`;
  msg += `📍 *Payment:* Cash on Delivery / Pay at Restaurant\n`;
  msg += `🕐 *Placed at:* ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}\n\n`;
  msg += `Thank you for choosing Godavari Vindu! 🙏`;

  return msg;
}

// ── Cart Component ──────────────────────────────────────────────────────────

export default function Cart({ isOpen, setIsOpen }) {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [orderSent, setOrderSent] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(() => ({
    full_name: user?.username || '',
    email: user?.email || '',
    phone: '',
  }));

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  // ── WhatsApp Order Handler ──
  const handleWhatsAppOrder = () => {
    const message = buildWhatsAppMessage(cart, customerInfo, totalPrice);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setOrderSent(true);
    setTimeout(() => setOrderSent(false), 4000);
  };

  // ── Razorpay Checkout Handler ──
  const handleRazorpayCheckout = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Failed to load payment SDK. Please check your internet connection.');
      setLoading(false);
      return;
    }

    const response = await createRazorpayOrder({
      items: cart,
      ...customerInfo,
    });

    const { razorpay_order_id, amount, currency, key_id, order_id, customer } = response.data;

    const options = {
      key: key_id,
      amount: amount,
      currency: currency,
      name: 'Godavari Vindu',
      description: 'Authentic Luxury Dining Order',
      image: '/favicon.svg',
      order_id: razorpay_order_id,
      handler: async function (paymentResponse) {
        try {
          setLoading(true);
          const verificationResponse = await verifyRazorpayPayment({
            razorpay_order_id: razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            order_id: order_id,
          });

          if (verificationResponse.status === 200) {
            clearCart();
            setIsOpen(false);
            window.location.href = `/success?order_id=${order_id}`;
          } else {
            alert('Payment verification failed.');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          alert('Error verifying payment.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.contact,
        method: selectedMethod?.razorpayMethod || 'upi',
      },
      theme: {
        color: selectedMethod?.brandColor || '#D4AF37',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (failResponse) {
      console.error(failResponse.error);
      alert(`Payment failed: ${failResponse.error.description}`);
    });
    rzp.open();
  };

  // ── Unified Checkout ──
  const handleCheckout = async () => {
    if (!isLoggedIn) {
      sessionStorage.setItem('gv_resume_checkout', 'true');
      setIsOpen(false);
      navigate('/login', {
        state: {
          from: { pathname: location.pathname },
          message: 'Please sign in to place your order.',
        },
      });
      return;
    }

    if (!customerInfo.full_name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in your contact details');
      return;
    }

    if (paymentMethod === 'whatsapp') {
      handleWhatsAppOrder();
      return;
    }

    setLoading(true);
    try {
      await handleRazorpayCheckout();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Dynamic Button Label ──
  const getCheckoutLabel = () => {
    if (loading) return 'Processing...';
    if (paymentMethod === 'whatsapp') return `Order via WhatsApp · ₹${totalPrice.toFixed(0)}`;
    return `Pay ₹${totalPrice.toFixed(0)} with ${selectedMethod?.name || 'Razorpay'}`;
  };

  const getCheckoutIcon = () => {
    if (paymentMethod === 'whatsapp') return <MessageCircle size={20} />;
    if (paymentMethod === 'card') return <CreditCard size={20} />;
    return <Smartphone size={20} />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-112.5 bg-charcoal border-l border-white/10 z-101 shadow-2xl flex flex-col"
          >
            <div className="p-5 flex justify-between items-center border-b border-white/10 shrink-0 bg-charcoal">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-gold" size={22} />
                <h2 className="text-xl font-heading font-bold text-white">Your Cart</h2>
                <span className="bg-gold text-charcoal px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Scrollable Body (Items + Delivery + Payment) ── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full min-h-75 flex flex-col items-center justify-center text-white/40 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold/60">
                    <ShoppingBag size={40} strokeWidth={1.5} />
                  </div>
                  <p className="text-xl font-heading text-white/70 italic">Your cart is empty</p>
                  <p className="text-xs text-white/40 max-w-xs text-center">Add delicious dishes from our menu to begin your luxury dining experience.</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-2 text-gold border border-gold/40 bg-gold/10 px-6 py-2.5 rounded-full hover:bg-gold hover:text-charcoal font-semibold transition-all duration-300 shadow-md cursor-pointer"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* ── Cart Items List Section ── */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-1">
                      <h3 className="text-xs font-heading uppercase tracking-widest font-bold text-gold/90">Selected Dishes</h3>
                      <button
                        onClick={clearCart}
                        className="text-[11px] text-white/40 hover:text-red-400 underline transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cart.map((item) => (
                        <motion.div
                          layout
                          key={item.id}
                          className="relative flex gap-3.5 p-3.5 rounded-2xl bg-white/[0.07] border border-white/15 shadow-xl hover:border-gold/40 transition-all duration-300 group"
                        >
                          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-black/40 border border-gold/30 shrink-0 shadow-md">
                            <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>

                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0 pr-1">
                                <h3 className="text-base font-heading font-bold text-white truncate tracking-wide group-hover:text-gold transition-colors">{item.name}</h3>
                                {item.portion && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-[11px] font-body font-bold bg-gold/20 text-gold border border-gold/40 shadow-xs">
                                    {item.portion}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                title="Remove item"
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all shrink-0 cursor-pointer"
                              >
                                <X size={15} />
                              </button>
                            </div>

                            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/10">
                              <div className="flex items-center gap-2 bg-black/60 border border-white/20 rounded-xl p-1">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center text-white/90 hover:text-charcoal hover:bg-gold rounded-lg transition-all font-bold cursor-pointer"
                                >
                                  <Minus size={13} strokeWidth={2.5} />
                                </button>
                                <span className="text-white font-bold text-sm min-w-5 text-center font-body">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center text-white/90 hover:text-charcoal hover:bg-gold rounded-lg transition-all font-bold cursor-pointer"
                                >
                                  <Plus size={13} strokeWidth={2.5} />
                                </button>
                              </div>

                              <div className="text-right">
                                <span className="text-xs text-white/50 font-body block leading-none mb-0.5">₹{Number(item.price).toFixed(2)} each</span>
                                <span className="text-gold font-body font-bold text-base tracking-tight">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* ── Customer Delivery Details ── */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h4 className="text-xs font-heading uppercase tracking-widest font-bold text-gold/90">Delivery Details</h4>
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Full Name *"
                      value={customerInfo.full_name}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:border-gold focus:bg-white/15 outline-none transition-all shadow-inner"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:border-gold focus:bg-white/15 outline-none transition-all shadow-inner"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number *"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:border-gold focus:bg-white/15 outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* ── Payment Method Selector ── */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h4 className="text-xs font-heading uppercase tracking-widest font-bold text-gold/90">
                      Payment Method
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {PAYMENT_METHODS.map((method) => {
                        const isSelected = paymentMethod === method.id;
                        const Icon = method.icon;
                        return (
                          <motion.button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            whileTap={{ scale: 0.95 }}
                            className={`relative flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-xs font-body transition-all duration-300 cursor-pointer overflow-hidden
                              ${isSelected
                                ? `${method.borderActive} ${method.shadowActive} border-opacity-80`
                                : 'border-white/10 hover:border-white/25'
                              }`}
                            style={{
                              backgroundColor: isSelected ? method.brandBg : 'rgba(255,255,255,0.03)',
                            }}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="paymentIndicator"
                                className="absolute top-1 right-1"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              >
                                <CheckCircle2 size={10} style={{ color: method.brandColor }} />
                              </motion.div>
                            )}

                            <span className="flex items-center justify-center h-7 w-full shrink-0">
                              <Icon />
                            </span>
                            <span
                              className="font-heading text-[11px] leading-tight font-semibold"
                              style={{ color: isSelected ? method.brandColor : 'rgba(255,255,255,0.7)' }}
                            >
                              {method.name}
                            </span>
                            <span className="text-[9px] text-white/40 leading-none">{method.subtitle}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Order Sent Toast ── */}
                  <AnimatePresence>
                    {orderSent && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 bg-[#25D366]/15 border border-[#25D366]/30 rounded-xl p-3 text-[#25D366] text-xs font-body"
                      >
                        <CheckCircle2 size={16} />
                        <span>Order sent to WhatsApp! The restaurant will confirm shortly.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* ── Sticky Bottom Footer (Price Total + Checkout Button) ── */}
            {cart.length > 0 && (
              <div className="p-5 bg-charcoal/95 backdrop-blur-xl border-t border-white/15 space-y-3 shrink-0 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-baseline text-xs text-white/60">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-white/80 font-body">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-heading text-white">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-gold font-bold text-2xl tracking-tight">₹{totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-heading text-base font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: paymentMethod === 'whatsapp' ? '#25D366' : '#D4AF37',
                    color: paymentMethod === 'whatsapp' ? '#fff' : '#1A1A1A',
                  }}
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      {getCheckoutIcon()}
                      {getCheckoutLabel()}
                    </>
                  )}
                </button>

                <p className="text-center text-white/40 text-[11px] font-body">
                  {paymentMethod === 'whatsapp'
                    ? 'Direct WhatsApp order confirmation'
                    : `100% Secure Payment powered by Razorpay`}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
