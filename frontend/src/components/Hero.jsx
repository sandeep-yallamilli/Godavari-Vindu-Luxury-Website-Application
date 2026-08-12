import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSite } from '../context/SiteContext';

export default function Hero() {
  const { getAssetUrl } = useSite();
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-text',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power4.out', delay: 0.5 }
      );

      gsap.to('.hero-bg', {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="hero-bg absolute inset-[0%] bg-cover bg-center"
          style={{ backgroundImage: `url("${getAssetUrl('hero_bg', '/images/Background design-1.png')}")` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-charcoal/40 via-charcoal/60 to-charcoal" />
      </div>

      <div ref={textRef} className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-16 sm:pt-0">
        <p className="hero-text text-gold text-xs sm:text-sm md:text-base tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-6">
          A Culinary Symphony
        </p>
        <h1 className="hero-text text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 sm:mb-8 leading-tight">
          Experience <br className="hidden sm:inline" /> <span className="text-gradient-gold">True Luxury</span>
        </h1>
        <p className="hero-text text-white/70 text-base sm:text-lg md:text-xl font-body max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
          Discover a symphony of flavors where cinematic ambiance meets Michelin-starred excellence at Godavari Vindu.
        </p>
        <div className="hero-text">
          <a
            href="#reservation"
            className="inline-block px-7 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm bg-transparent border border-gold text-gold font-body tracking-wider uppercase hover:bg-gold hover:text-charcoal transition-all duration-500 rounded-sm"
          >
            Reserve a Table
          </a>
        </div>
      </div>
    </section>
  );
}
