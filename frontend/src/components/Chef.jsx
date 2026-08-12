import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSite } from '../context/SiteContext';

gsap.registerPlugin(ScrollTrigger);

export default function Chef() {
  const { getAssetUrl } = useSite();
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.chef-img', {
        scale: 1.2,
        opacity: 0,
        duration: 1.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      });

      gsap.from('.chef-text', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="chef" ref={sectionRef} className="py-16 sm:py-24 md:py-32 bg-charcoal/95 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="w-full md:w-1/2 overflow-hidden rounded-xl h-72 sm:h-100 md:h-140 relative gold-glow">
            <img
              src={getAssetUrl('chef_photo', '/images/chef.png')}
              alt="Executive Chef"
              className="chef-img w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h4 className="chef-text text-gold tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 sm:mb-4">The Mastermind</h4>
            <h2 className="chef-text text-3xl sm:text-5xl md:text-6xl font-heading text-white mb-6 sm:mb-8">
              Chef <span className="italic text-white/90">Antonio</span>
            </h2>
            <div className="w-12 h-1 bg-gold mb-6 sm:mb-8 chef-text" />
            <p className="chef-text text-white/70 font-body text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              With three Michelin stars under his belt, Chef Antonio brings a symphony of flavors that bridge traditional recipes with avant-garde culinary techniques.
            </p>
            <p className="chef-text text-white/70 font-body text-base sm:text-lg leading-relaxed">
              Every dish is a canvas, and every ingredient is selected with uncompromising standards from the world's most exclusive purveyors.
            </p>
            <div className="mt-8 sm:mt-12 chef-text">
              <img src={getAssetUrl('chef_signature', '/images/Chef_Antonio.png')} className="h-28 sm:h-36 md:h-48 opacity-50 filter invert" alt="Chef Signature" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
