import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchMenuItems, fetchCategories } from '../services/api';
import { Plus, Minus } from 'lucide-react';
import SkeletonMenuCard from './SkeletonMenuCard';

gsap.registerPlugin(ScrollTrigger);

const cleanText = (str) => {
  if (!str) return '';
  return str
    .replace(/â€“/g, '–')
    .replace(/â€”/g, '—')
    .replace(/â€™/g, "'")
    .replace(/\u00c3\u00a2\u00e2\u20ac\u2122/g, "'");
};

export default function Menu() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardsListRef = useRef(null);
  const catScrollRef = useRef(null);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPortions, setSelectedPortions] = useState({});
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadMenuAndCategories = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([
          fetchMenuItems(),
          fetchCategories()
        ]);
        const menuData = Array.isArray(menuRes?.data) ? menuRes.data : (menuRes?.data?.results || []);
        const catData = Array.isArray(catRes?.data) ? catRes.data : (catRes?.data?.results || []);
        setDishes(menuData);
        setCategories(catData);
      } catch (err) {
        console.error('Error loading menu:', err);
        setError(true);
        setDishes([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadMenuAndCategories();
  }, []);

  const filteredDishes = selectedCategory === 'all'
    ? dishes
    : dishes.filter(dish => {
      const categoryObj = categories.find(c => c.slug === selectedCategory);
      return categoryObj ? dish.category === categoryObj.id : false;
    });

  useLayoutEffect(() => {
    if (filteredDishes.length === 0 || loading) return;

    let ctx = gsap.context(() => {
      const list = cardsListRef.current;
      const container = containerRef.current;
      if (!list || !container) return;

      const sections = gsap.utils.toArray('.menu-card');
      if (sections.length <= 1) return;

      const scrollDistance = list.scrollWidth - container.offsetWidth;
      if (scrollDistance <= 0) return;

      gsap.to(list, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          end: () => '+=' + Math.max(scrollDistance, 600)
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredDishes, loading, selectedCategory]);

  const getImageUrl = (url) => {
    if (!url) return '';
    const mediaMatch = url.match(/\/media\/.*/);
    if (mediaMatch) return mediaMatch[0];
    if (url.startsWith('media/')) return '/' + url;
    if (url.startsWith('http')) return url;
    return `/media/${url.replace(/^\//, '')}`;
  };

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (cardsListRef.current) {
      gsap.set(cardsListRef.current, { x: 0 });
    }
  };

  return (
    <section id="menu" ref={sectionRef} className="h-screen min-h-155 flex flex-col bg-charcoal relative overflow-hidden pt-8 sm:pt-10 md:pt-14 pb-4 md:pb-6">
      <div className="w-full px-4 sm:px-6 md:px-20 z-20 flex flex-col items-start gap-2.5 sm:gap-3 md:gap-4 mb-3 shrink-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading text-white whitespace-nowrap">
          Our <span className="text-gold italic">Signatures</span>
        </h2>

        {/* Categories Tab Selector */}
        {categories.length > 0 && (
          <div className="relative w-full group/cats">
            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
              <div className="w-8 h-full bg-linear-to-r from-charcoal to-transparent pointer-events-none" />
              <button
                onClick={() => {
                  if (catScrollRef.current) catScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                }}
                className="absolute left-0 w-7 h-7 rounded-full bg-charcoal/90 border border-white/20 text-white/70 hover:text-gold hover:border-gold/40 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-md"
                aria-label="Scroll categories left"
              >
                ‹
              </button>
            </div>

            <div
              ref={catScrollRef}
              className="flex gap-2.5 overflow-x-auto no-scrollbar py-1.5 px-8 w-full"
            >
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-1.5 rounded-full border text-xs md:text-sm font-heading transition-all duration-300 cursor-pointer shrink-0 ${selectedCategory === 'all'
                  ? 'bg-gold border-gold text-charcoal font-semibold shadow-md shadow-gold/20'
                  : 'border-white/20 text-white/60 hover:text-white hover:border-white/40 bg-charcoal/40 backdrop-blur-xs'
                  }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-4 py-1.5 rounded-full border text-xs md:text-sm font-heading transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 ${selectedCategory === cat.slug
                    ? 'bg-gold border-gold text-charcoal font-semibold shadow-md shadow-gold/20'
                    : 'border-white/20 text-white/60 hover:text-white hover:border-white/40 bg-charcoal/40 backdrop-blur-xs'
                    }`}
                >
                  {cleanText(cat.name)}
                </button>
              ))}
            </div>

            <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
              <div className="w-8 h-full bg-linear-to-l from-charcoal to-transparent pointer-events-none" />
              <button
                onClick={() => {
                  if (catScrollRef.current) catScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                }}
                className="absolute right-0 w-7 h-7 rounded-full bg-charcoal/90 border border-white/20 text-white/70 hover:text-gold hover:border-gold/40 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-md"
                aria-label="Scroll categories right"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      <div ref={containerRef} className="w-full flex-1 flex items-center overflow-hidden relative">
        {error ? (
          <div className="w-full text-center text-red-400/60 italic font-body">
            Our menu is currently undergoing a culinary refresh. Please check back shortly.
          </div>
        ) : loading ? (
          <ul className="flex w-full px-6 md:px-20">
            {[1, 2, 3].map((i) => (
              <SkeletonMenuCard key={i} />
            ))}
          </ul>
        ) : filteredDishes.length > 0 ? (
          <ul
            ref={cardsListRef}
            className={`flex flex-nowrap px-[5vw] md:px-[8vw] items-center ${filteredDishes.length <= 2 ? 'w-full justify-center' : ''}`}
          >
            {filteredDishes.map((dish) => {
              const portion = selectedPortions[dish.id] || 'Full';
              const hasHalf = dish.has_half_option && dish.price_half != null;
              const activePrice = portion === 'Half' && hasHalf ? dish.price_half : dish.price;
              const cartItemId = `${dish.id}-${portion.toLowerCase()}`;
              const cartQty = getItemQuantity(cartItemId);

              const handleAddToCart = () => {
                if (!isLoggedIn) {
                  navigate('/login', {
                    state: {
                      from: { pathname: location.pathname },
                      message: 'Please sign in to place your order.',
                    },
                  });
                  return;
                }
                addToCart({
                  id: cartItemId,
                  menu_item_id: dish.id,
                  name: cleanText(dish.name),
                  portion: portion,
                  price: activePrice,
                  image: dish.image,
                  quantity: 1,
                });
              };

              return (
                <li
                  key={dish.id}
                  className="menu-card shrink-0 w-[85vw] sm:w-[50vw] md:w-[35vw] lg:w-[28vw] max-w-96 h-[58vh] sm:h-[55vh] max-h-125 min-h-102.5 mx-2.5 sm:mx-3 md:mx-5 relative group perspective-1000 list-none"
                >
                  <div className="w-full h-full glass-panel rounded-2xl overflow-hidden transition-all duration-500 transform group-hover:scale-[1.01] border border-gold/20 group-hover:border-gold/60 shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] flex flex-col relative z-10">
                    {/* Image Glow Container */}
                    <div className="h-[46%] w-full relative overflow-hidden shrink-0 group/img border-b border-gold/30">
                      {/* Crisp, High-Clarity Bright Image */}
                      <img
                        src={getImageUrl(dish.image)}
                        alt={cleanText(dish.name)}
                        className="w-full h-full object-cover relative z-0 transform transition-all duration-700 group-hover:scale-105 brightness-110 contrast-105 saturate-[1.08] group-hover:brightness-120 group-hover:contrast-110"
                      />
                      {/* Subtle Bottom Edge Fade Only (Keeps Food Photo 100% Crisp & Clear) */}
                      <div className="absolute inset-0 bg-linear-to-t from-charcoal/60 via-transparent to-transparent opacity-40 pointer-events-none z-1" />

                      {/* Portion & Serves Badge */}
                      <span className="absolute top-3 right-3 bg-charcoal/90 text-gold border border-gold/50 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-heading tracking-wide z-10 shadow-[0_0_12px_rgba(212,175,55,0.3)] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#D4AF37]" />
                        {hasHalf
                          ? `${portion} · ${portion === 'Half' ? (dish.serves_half || 'Serves 1-2') : (dish.serves || 'Serves 3-4')}`
                          : (dish.serves || 'Serves 1')
                        }
                      </span>
                    </div>

                    <div className="flex-1 p-4 md:p-5 flex flex-col justify-between bg-charcoal/95 overflow-hidden">
                      <div className="overflow-hidden">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h3 className="text-lg md:text-xl font-heading text-white line-clamp-1">{cleanText(dish.name)}</h3>
                          <span className="text-gold font-body text-base md:text-lg font-bold whitespace-nowrap">₹{activePrice}</span>
                        </div>
                        <p className="text-white/60 font-body text-xs leading-relaxed line-clamp-2 mb-2">
                          {cleanText(dish.description)}
                        </p>
                      </div>

                      {/* Portion Selector (Half vs Full) */}
                      {hasHalf && (
                        <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/10 my-1">
                          <button
                            type="button"
                            onClick={() => setSelectedPortions(prev => ({ ...prev, [dish.id]: 'Half' }))}
                            className={`flex-1 py-1 px-2 rounded-md text-[11px] font-heading transition-all cursor-pointer ${portion === 'Half'
                              ? 'bg-gold text-charcoal font-bold shadow-xs'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                              }`}
                          >
                            Half (₹{dish.price_half})
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedPortions(prev => ({ ...prev, [dish.id]: 'Full' }))}
                            className={`flex-1 py-1 px-2 rounded-md text-[11px] font-heading transition-all cursor-pointer ${portion === 'Full'
                              ? 'bg-gold text-charcoal font-bold shadow-xs'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                              }`}
                          >
                            Full (₹{dish.price})
                          </button>
                        </div>
                      )}

                      {/* Quantity Controls / Add to Cart */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between mt-auto">
                        <span className="text-[11px] text-white/40 font-body">
                          {hasHalf
                            ? `${portion} (${portion === 'Half' ? (dish.serves_half || 'Serves 1-2') : (dish.serves || 'Serves 3-4')})`
                            : (dish.serves || 'Serves 1')
                          }
                        </span>

                        {cartQty > 0 ? (
                          <div className="flex items-center gap-1.5 bg-gold/10 border border-gold/40 rounded-full p-1 shadow-md shadow-gold/10">
                            <button
                              onClick={() => updateQuantity(cartItemId, cartQty - 1)}
                              aria-label={`Decrease quantity of ${cleanText(dish.name)} ${portion}`}
                              className="w-6 h-6 rounded-full bg-charcoal text-gold hover:bg-gold hover:text-charcoal flex items-center justify-center transition-all cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-gold font-heading text-xs px-1 min-w-4 text-center font-bold">
                              {cartQty}
                            </span>
                            <button
                              onClick={() => updateQuantity(cartItemId, cartQty + 1)}
                              aria-label={`Increase quantity of ${cleanText(dish.name)} ${portion}`}
                              className="w-6 h-6 rounded-full bg-gold text-charcoal hover:bg-gold/90 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={handleAddToCart}
                            aria-label={`Add ${cleanText(dish.name)} to cart`}
                            className="bg-gold text-charcoal px-4 py-1.5 rounded-full font-heading text-xs md:text-sm font-semibold transform transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md hover:shadow-gold/20 flex items-center gap-1"
                          >
                            <Plus size={13} /> {hasHalf ? `Add ${portion}` : 'Add to Cart'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="w-full text-center text-white/40 italic font-body">
            Discovering our seasonal flavors...
          </div>
        )}
      </div>
    </section>
  );
}

