import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiShare2, FiHeart, FiPhone, FiMail, FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import { MdBedroomParent, MdBathtub } from 'react-icons/md';
import { useStore } from '../store/useStore';
import MpesaModal from '../components/MpesaModal';
import { formatPrice, formatDate, maskPhoneNumber, maskEmail, maskLocation } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, paidPropertyIds, currency, exchangeRate } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Property Not Found</h1>
        <p className="text-slate-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/properties')}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  const hasPaid = paidPropertyIds.includes(property.id);
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    } else {
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div>
      {/* Gallery */}
      <div className="relative h-96 md:h-[600px] bg-slate-200">
        {property.images.length > 0 ? (
          <>
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
              {currentImageIndex + 1} / {property.images.length}
            </div>

            {/* Navigation Arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-10"
                >
                  <FiChevronLeft className="text-2xl" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-10"
                >
                  <FiChevronRight className="text-2xl" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-300">
            <FiImage className="text-6xl text-slate-500" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleFavorite}
            className="bg-white hover:bg-slate-100 p-3 rounded-full transition-colors"
          >
            <FiHeart className={`text-2xl ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-800'}`} />
          </button>
          <button
            onClick={handleShare}
            className="bg-white hover:bg-slate-100 p-3 rounded-full transition-colors"
          >
            <FiShare2 className="text-2xl text-slate-800" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold capitalize">
                  {property.category}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                  {property.listingType}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">{property.title}</h1>
              <div className="flex items-center gap-2 text-slate-600">
                <FiMapPin className="text-amber-500" />
                <span>{hasPaid ? property.location : maskLocation(property.location)}</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {hasPaid ? property.address : maskLocation(property.address)}
              </p>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white mb-8"
            >
              <p className="text-sm opacity-90 mb-1">Price</p>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-4xl md:text-5xl font-bold">{formatPrice(property.price, currency, exchangeRate)}</h2>
                <span className="text-base md:text-lg opacity-90">({formatPrice(property.price, currency === 'KES' ? 'USD' : 'KES', exchangeRate)})</span>
                {property.priceType === 'monthly' && <span className="text-lg">/ month</span>}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Key Features</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {property.bedrooms && (
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <MdBedroomParent className="text-3xl text-amber-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Bedrooms</p>
                    <p className="text-2xl font-bold text-slate-800">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <MdBathtub className="text-3xl text-amber-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Bathrooms</p>
                    <p className="text-2xl font-bold text-slate-800">{property.bathrooms}</p>
                  </div>
                )}
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-amber-500 mb-2">{property.area}</p>
                  <p className="text-sm text-slate-600">Square Meters</p>
                </div>
              </div>
            </motion.div>

            {/* Amenities */}
            {property.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Amenities</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Description</h3>
              <p className="text-slate-700 leading-relaxed">{property.description}</p>
            </motion.div>

            {/* Additional Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid md:grid-cols-2 gap-4"
            >
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Listed On</p>
                <p className="text-slate-800 font-semibold">{formatDate(property.createdAt)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Property Address</p>
                <p className="text-slate-800 font-semibold">{hasPaid ? property.address : maskLocation(property.address)}</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Contact Property Lister</h3>

              {/* Lister Info */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Listed by</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-slate-800">{property.ownerName}</p>
                {property.isListerVerified && (
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Verified Property Lister
                  </span>
                )}
              </div>
            </div>

              {/* Contact Details */}
              {hasPaid ? (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <FiPhone className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Phone</p>
                      <p className="font-semibold text-slate-800">{property.ownerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <FiMail className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Email</p>
                      <p className="font-semibold text-slate-800">{property.ownerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <FiMapPin className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Location</p>
                      <p className="font-semibold text-slate-800">{property.location}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                  <p className="text-sm text-amber-800 font-semibold mb-2">Contact info is hidden</p>
                  <p className="text-xs text-amber-700 mb-4">
                    Pay KES 100 via M-Pesa STK to view phone number, email, and exact location
                  </p>
                  <div className="space-y-2 text-xs text-amber-700">
                    <p>Phone: {maskPhoneNumber(property.ownerPhone)}</p>
                    <p>Email: {maskEmail(property.ownerEmail)}</p>
                    <p>Location: {maskLocation(property.address)}</p>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              {hasPaid ? (
                <div className="space-y-3">
                  <a
                    href={`tel:${property.ownerPhone}`}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FiPhone />
                    Call Now
                  </a>
                  <a
                    href={`mailto:${property.ownerEmail}`}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMail />
                    Email Lister
                  </a>
                </div>
              ) : (
                <button
                  onClick={() => setShowMpesaModal(true)}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all mb-3"
                >
                  Unlock Contact Info - KES 100
                </button>
              )}

              {!hasPaid && (
                <div className="text-xs text-slate-500 mt-2">
                  Payment uses M-Pesa Express STK prompt for KES 100.
                </div>
              )}

              {/* Info Message */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-semibold">Note:</span> Always verify property details and visit in person before making any commitments.
                </p>
              </div>
            </div>

            {/* Report Listing */}
            <button className="w-full mt-6 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-50 transition-colors">
              Report Listing
            </button>
          </motion.div>
        </div>
      </div>

      {/* M-Pesa Modal */}
      <MpesaModal
        isOpen={showMpesaModal}
        onClose={() => setShowMpesaModal(false)}
        propertyId={property.id}
        amount={100}
      />
    </div>
  );
}
