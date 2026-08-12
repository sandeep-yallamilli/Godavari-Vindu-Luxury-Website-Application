import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, Sparkles } from 'lucide-react';
import { fetchTestimonials } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    fetchTestimonials()
      .then(res => {
        const data = Array.isArray(res?.data) ? res.data : (res?.data?.results || []);
        setTestimonials(data);
      })
      .catch(err => {
        console.error('Error fetching testimonials:', err);
        setTestimonials([]);
      });
  }, []);

  useLayoutEffect(() => {
    if (testimonials.length === 0) return;

    let ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Staggered Cards Entrance
      gsap.fromTo(
        '.testimonial-card',
        { opacity: 0, y: 60, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.2,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Stars Pop Animation
      gsap.fromTo(
        '.star-icon',
        { scale: 0, opacity: 0, rotate: -30 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [testimonials]);

  const getInitials = (name) => {
    if (!name) return 'GV';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <section id="reviews" ref={sectionRef} className="py-16 sm:py-24 md:py-32 bg-charcoal/60 relative overflow-hidden">
      {/* Top Divider Accent Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

      {/* Decorative Golden Background Glow Spheres */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none transform -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header Section */}
        <div ref={headerRef} className="text-center mb-12 sm:mb-16 md:mb-20 flex flex-col items-center">
          <span className="inline-flex items-center gap-2 text-gold tracking-[0.25em] uppercase text-xs md:text-sm font-semibold mb-3 bg-gold/10 border border-gold/30 px-3.5 sm:px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Sparkles size={14} className="animate-pulse" /> Reviews & Experiences
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white tracking-tight">
            Words From Our <span className="text-gold italic font-normal">Esteemed Guests</span>
          </h2>
          <div className="w-24 h-0.5 bg-linear-to-r from-transparent via-gold to-transparent mt-4 opacity-70" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={t.id || idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="testimonial-card glass-panel p-6 sm:p-8 rounded-2xl relative group hover:border-gold/60 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)] flex flex-col justify-between border border-gold/20 bg-charcoal/80"
            >
              {/* Floating Quote Icon */}
              <Quote
                className="absolute top-6 right-6 text-gold/15 group-hover:text-gold/40 group-hover:rotate-12 transition-all duration-500 transform"
                size={48}
              />

              <div>
                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="star-icon text-gold fill-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                      size={18}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-white/85 font-body text-base md:text-lg italic mb-8 leading-relaxed relative z-10">
                  "{t.text}"
                </p>
              </div>

              {/* Author Bio Footer */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/10 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-heading font-bold text-sm tracking-wider shadow-[0_0_12px_rgba(212,175,55,0.2)] group-hover:border-gold group-hover:scale-105 transition-all">
                  {getInitials(t.name)}
                </div>
                <div>
                  <h5 className="text-white font-heading text-lg group-hover:text-gold transition-colors duration-300">
                    {t.name}
                  </h5>
                  <p className="text-gold/70 text-xs font-body uppercase tracking-widest font-medium">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Divider Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}

