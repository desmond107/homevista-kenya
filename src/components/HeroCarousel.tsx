import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920',
    title: 'Find Your Dream Home',
    subtitle: 'Discover the perfect property in Kenya',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920',
    title: 'Luxury Villas & Estates',
    subtitle: 'Premium properties in prime locations',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920',
    title: 'Modern Living Spaces',
    subtitle: 'Contemporary homes for modern families',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920',
    title: 'Investment Properties',
    subtitle: 'Build your real estate portfolio',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920',
    title: 'Rental Properties',
    subtitle: 'Quality homes for every budget',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('buy');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties?type=${searchType}&search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Animated Property Coracle
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200">
            {slides[currentSlide].subtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-200">
            <span className="px-4 py-2 rounded-full bg-white/10">Urban Listings</span>
            <span className="px-4 py-2 rounded-full bg-white/10">Verified Listers</span>
            <span className="px-4 py-2 rounded-full bg-white/10">Instant M-Pesa Unlock</span>
          </div>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-4xl"
        >
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 md:p-3 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              {/* Search Type Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1">
                {['buy', 'rent', 'lease'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSearchType(type)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                      searchType === type
                        ? 'bg-amber-500 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by location, property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-8 md:gap-16 mt-12 text-white"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-500">500+</div>
            <div className="text-sm md:text-base text-slate-300">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-500">200+</div>
            <div className="text-sm md:text-base text-slate-300">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-500">50+</div>
            <div className="text-sm md:text-base text-slate-300">Realtors</div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-20"
      >
        <FiChevronLeft className="text-2xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-20"
      >
        <FiChevronRight className="text-2xl" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-amber-500 w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
