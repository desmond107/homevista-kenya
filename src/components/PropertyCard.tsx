import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiZap, FiImage } from 'react-icons/fi';
import { MdBathtub, MdBedroomParent } from 'react-icons/md';
import { Property } from '../types';
import { formatPrice } from '../utils/formatters';
import { useStore } from '../store/useStore';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const { currency, exchangeRate } = useStore();
  const categoryColors: Record<string, string> = {
    apartment: 'bg-blue-100 text-blue-700',
    house: 'bg-green-100 text-green-700',
    villa: 'bg-purple-100 text-purple-700',
    commercial: 'bg-orange-100 text-orange-700',
    land: 'bg-amber-100 text-amber-700',
  };

  const listingColors: Record<string, string> = {
    buy: 'text-green-600',
    rent: 'text-blue-600',
    sell: 'text-purple-600',
    lease: 'text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
    >
      <Link to={`/property/${property.id}`}>
        {/* Image Container */}
        <div className="relative h-64 bg-slate-200 overflow-hidden">
          {property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-300">
              <FiImage className="text-4xl text-slate-500" />
            </div>
          )}

          {/* Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${categoryColors[property.category]}`}>
              {property.category}
            </span>
            {property.isFeatured && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
                Featured
              </span>
            )}
          </div>

          {property.isListerVerified && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              Verified Lister
            </div>
          )}

          {/* Image Count */}
          {property.images.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
              {property.images.length} Photos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-slate-600 mb-4">
            <FiMapPin className="text-amber-500 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-amber-600">
              {formatPrice(property.price, currency, exchangeRate)}
            </div>
            <div className="text-xs text-slate-500">
              {currency === 'KES' ? 'USD' : 'KES'} {formatPrice(property.price, currency === 'KES' ? 'USD' : 'KES', exchangeRate).replace('KES ', '').replace('$', '')}
            </div>
            <p className="text-xs text-slate-400">Up to {Math.min(property.images.length || 1, 10)} images uploaded</p>
            <div className={`text-sm font-semibold capitalize ${listingColors[property.listingType]}`}>
              {property.listingType === 'buy' && 'For Sale'}
              {property.listingType === 'rent' && 'For Rent'}
              {property.listingType === 'lease' && 'For Lease'}
              {property.listingType === 'sell' && 'For Selling'}
              {' '}
              {property.priceType === 'monthly' && '/ month'}
              {property.priceType === 'sale' && ''}
            </div>
          </div>

          {/* Features */}
          <div className="flex items-center justify-between text-slate-600 text-sm mb-4 pb-4 border-b border-slate-200">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <MdBedroomParent className="text-amber-500" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <MdBathtub className="text-amber-500" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <FiZap className="text-amber-500" />
              <span>{property.area} m²</span>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all">
            View Details
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
