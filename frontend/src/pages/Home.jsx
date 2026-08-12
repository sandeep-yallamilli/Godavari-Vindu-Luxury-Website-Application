import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Menu from '../components/Menu';
import Chef from '../components/Chef';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Reservation from '../components/Reservation';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import WhatsAppButton from '../components/WhatsAppButton';

export default function Home({ setIsCartOpen, isCartOpen }) {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn && sessionStorage.getItem('gv_resume_checkout') === 'true') {
      sessionStorage.removeItem('gv_resume_checkout');
      setIsCartOpen(true);
    }
  }, [isLoggedIn, setIsCartOpen]);

  return (
    <div className="relative w-full min-h-screen bg-charcoal overflow-hidden">
      <div className="grain-overlay" />
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      <main>
        <Hero />
        <About />
        <Menu />
        <Chef />
        <Gallery />
        <Testimonials />
        <Reservation />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
