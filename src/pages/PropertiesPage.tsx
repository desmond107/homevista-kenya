import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';

export default function PropertiesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const { properties, filters } = useStore();
  const queryParams = new URLSearchParams(window.location.search);
  const searchQuery = queryParams.get('search') || '';
  const requestedType = queryParams.get('type');
  const requestedCategory = queryParams.get('category');

  // Apply filters
  const filteredProperties = properties.filter((property) => {
    if (!property.isApproved) return false;

    const normalizedSearch = searchQuery.toLowerCase();
    if (normalizedSearch) {
      const matchesSearch =
        property.title.toLowerCase().includes(normalizedSearch) ||
        property.location.toLowerCase().includes(normalizedSearch) ||
        property.category.toLowerCase().includes(normalizedSearch);
      if (!matchesSearch) return false;
    }

    if (requestedType && property.listingType !== requestedType) return false;
    if (requestedCategory && property.category !== requestedCategory) return false;

    if (filters.category !== 'all' && property.category !== filters.category) return false;
    if (filters.listingType !== 'all' && property.listingType !== filters.listingType) return false;
    if (filters.location !== 'all' && property.location !== filters.location) return false;
    if (property.price < filters.minPrice || property.price > filters.maxPrice) return false;
    if (
      filters.bedrooms !== 'all' &&
      property.bedrooms &&
      filters.bedrooms !== '5+' &&
      property.bedrooms !== parseInt(filters.bedrooms)
    ) {
      return false;
    }
    if (filters.bedrooms === '5+' && property.bedrooms && property.bedrooms < 5) return false;

    return true;
  });

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Properties</h1>
          <p className="text-xl text-slate-300">Find your perfect home in Kenya</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar isOpen={true} onClose={() => {}} />
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {/* Filter Button - Mobile */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg font-semibold text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <FiFilter />
              Filters
            </button>

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Found
              </h2>
              <p className="text-slate-600">
                Showing results for {requestedType ? `${requestedType} listings` : 'all listings'}{requestedCategory ? ` in ${requestedCategory}` : ''}{searchQuery ? ` matching "${searchQuery}"` : ''}.
              </p>
            </motion.div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiFilter className="text-2xl text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Properties Found</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Try adjusting your filters to find more properties that match your preferences.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </div>
  );
}
