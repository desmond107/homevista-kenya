import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useStore } from '../store/useStore';

export default function PopupAdvert() {
  const [isOpen, setIsOpen] = useState(false);
  const { adverts } = useStore();
  const activeAdverts = adverts.filter((a) => a.isActive);
  const [currentAdvert, setCurrentAdvert] = useState(0);

  useEffect(() => {
    if (activeAdverts.length === 0) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeAdverts.length]);

  if (activeAdverts.length === 0) return null;

  const advert = activeAdverts[currentAdvert];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-2xl overflow-hidden"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
            >
              <FiX className="text-2xl text-slate-800" />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="h-64 md:h-96 bg-slate-200">
                <img
                  src={advert.imageUrl}
                  alt={advert.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                  {advert.title}
                </h2>
                <p className="text-slate-600 mb-6">
                  Launch a pop-up coracle advert for your latest listings and reach thousands of buyers.
                </p>
                <a
                  href={advert.linkUrl}
                  onClick={() => setIsOpen(false)}
                  className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all w-fit"
                >
                  Visit
                </a>

                {/* Dots Navigation */}
                <div className="flex gap-2 mt-8">
                  {activeAdverts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAdvert(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentAdvert ? 'bg-amber-500 w-6' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
