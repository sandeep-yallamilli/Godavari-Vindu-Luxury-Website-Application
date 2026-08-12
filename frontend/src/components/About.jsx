import { useSite } from '../context/SiteContext';

export default function About() {
  const { getAssetUrl } = useSite();

  return (
    <section id="about" className="py-16 sm:py-24 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-white mb-4 sm:mb-6">
            Our <span className="text-gold italic">Story</span>
          </h2>
          <p className="text-white/70 font-body text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
            Welcome to Godavari Vindu, where tradition meets taste. Inspired by the rich culinary heritage of the Godavari river region, we bring authentic flavors to your table. Every dish is crafted with passion, using traditional recipes and the finest ingredients to create an unforgettable dining experience.
          </p>
          <p className="text-white/70 font-body text-sm sm:text-base leading-relaxed">
            From our family to yours, we invite you to savor the essence of our culture in every bite. Whether it's a casual meal or a special celebration, we are dedicated to serving excellence and creating lasting memories.
          </p>
        </div>
        <div className="flex-1 w-full h-64 sm:h-80 md:h-100 rounded-2xl overflow-hidden relative gold-glow">
          <img src={getAssetUrl('about_story', '/images/Godavari vindu story.png')} alt="Godavari Vindu restaurant interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-charcoal/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
