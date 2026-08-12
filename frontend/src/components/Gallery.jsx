import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSite } from '../context/SiteContext';

gsap.registerPlugin(ScrollTrigger);

const defaultGalleryImages = [
  { id: 1, src: '/images/gallery_1.png', alt: 'Interior 1', span: 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2' },
  { id: 2, src: '/images/dish_1.png', alt: 'Signature Dish', span: 'col-span-1 row-span-1' },
  { id: 3, src: '/images/hero_bg.png', alt: 'Luxury Ambiance', span: 'col-span-1 row-span-1 sm:row-span-2' },
  { id: 4, src: '/images/exterior design.png', alt: 'Exterior View', span: 'col-span-1 row-span-1' },
  { id: 5, src: '/images/interior design.png', alt: 'Interior View', span: 'col-span-1 row-span-1' },
  { id: 6, src: '/images/godavari_story.png', alt: 'Story View', span: 'col-span-1 row-span-1 sm:row-span-2' },
  { id: 7, src: '/images/menu card.png', alt: 'Menu View', span: 'col-span-1 row-span-1 sm:row-span-2' },
  { id: 8, src: '/images/Dinning design.png', alt: 'Dinning View', span: 'col-span-1 row-span-1' },
  { id: 9, src: '/images/beautiful paint.png', alt: 'Paint View', span: 'col-span-1 row-span-1' },
  { id: 10, src: '/images/background design.png', alt: 'Background View', span: 'col-span-1 row-span-1' },
];

const SPAN_MAP = {
  'col-span-1 row-span-1': 'col-span-1 row-span-1',
  'col-span-2 row-span-2': 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2',
  'col-span-1 row-span-2': 'col-span-1 row-span-1 sm:row-span-2',
  'col-span-2 row-span-1': 'col-span-1 sm:col-span-2 row-span-1',
  'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2': 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2',
  'col-span-1 row-span-1 sm:row-span-2': 'col-span-1 row-span-1 sm:row-span-2',
};

const getSpanClass = (rawSpan) => {
  if (!rawSpan) return 'col-span-1 row-span-1';
  return SPAN_MAP[rawSpan.trim()] || rawSpan;
};

export default function Gallery() {
  const { galleryImages, getImageUrl } = useSite();
  const sectionRef = useRef(null);

  const displayImages = galleryImages && galleryImages.length > 0
    ? galleryImages.map(img => ({
        id: img.id,
        src: getImageUrl(img.image),
        alt: img.alt,
        span: getSpanClass(img.span)
      }))
    : defaultGalleryImages;

  useEffect(() => {
    if (displayImages.length === 0) return;

    let ctx = gsap.context(() => {
      gsap.from('.gallery-item', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [displayImages]);

  return (
    <section id="gallery" ref={sectionRef} className="py-16 sm:py-24 md:py-32 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10 sm:mb-16">
          <h4 className="text-gold tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 sm:mb-4">Visual Symphony</h4>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading text-white">The <span className="italic">Gallery</span></h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px] sm:auto-rows-[230px] md:auto-rows-[250px]">
          {displayImages.map((img) => (
            <div key={img.id} className={`gallery-item relative overflow-hidden rounded-xl ${img.span} group cursor-pointer`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
