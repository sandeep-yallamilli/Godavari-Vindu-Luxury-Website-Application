import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import Home from './pages/Home';

const Success      = lazy(() => import('./pages/Success'));
const Cancel       = lazy(() => import('./pages/Cancel'));
const LoginPage    = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

gsap.registerPlugin(ScrollTrigger);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <SiteProvider>
          <CartProvider>
            <BrowserRouter>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen text-white bg-charcoal">
                  Loading…
                </div>
              }>
                <Routes>
                  <Route path="/"         element={<Home isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />} />
                  <Route path="/login"    element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/success"  element={<Success />} />
                  <Route path="/cancel"   element={<Cancel />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CartProvider>
        </SiteProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
