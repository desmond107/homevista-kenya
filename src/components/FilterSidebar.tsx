import { motion } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { locations } from '../data/mockData';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const { filters, setFilters, resetFilters } = useStore();

  const categories = ['all', 'apartment', 'house', 'villa', 'commercial', 'land'];
  const listingTypes = ['all', 'buy', 'rent', 'sell', 'lease'];
  const bedroomOptions = ['all', '1', '2', '3', '4', '5+'];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed md:static left-0 top-0 w-80 md:w-64 h-screen md:h-auto bg-white md:bg-slate-50 md:rounded-2xl md:p-6 z-40 overflow-y-auto md:overflow-y-visible shadow-xl md:shadow-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 md:p-0">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <FiFilter />
            <span>Filters</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="w-full mb-6 px-4 py-2 border-2 border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors"
        >
          Reset Filters
        </button>

        {/* Category Filter */}
        <div className="mb-8 px-4 md:px-0">
          <h3 className="font-bold text-slate-800 mb-4">Property Type</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={filters.category === cat}
                  onChange={(e) => setFilters({ category: e.target.value })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="ml-3 text-slate-700 capitalize font-medium">
                  {cat === 'all' ? 'All Categories' : cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Listing Type Filter */}
        <div className="mb-8 px-4 md:px-0">
          <h3 className="font-bold text-slate-800 mb-4">Listing Type</h3>
          <div className="space-y-2">
            {listingTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="listingType"
                  value={type}
                  checked={filters.listingType === type}
                  onChange={(e) => setFilters({ listingType: e.target.value })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="ml-3 text-slate-700 capitalize font-medium">
                  {type === 'all' ? 'All Types' : type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-8 px-4 md:px-0">
          <h3 className="font-bold text-slate-800 mb-4">Location</h3>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ location: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms Filter */}
        <div className="mb-8 px-4 md:px-0">
          <h3 className="font-bold text-slate-800 mb-4">Bedrooms</h3>
          <div className="space-y-2">
            {bedroomOptions.map((option) => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="bedrooms"
                  value={option}
                  checked={filters.bedrooms === option}
                  onChange={(e) => setFilters({ bedrooms: e.target.value })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="ml-3 text-slate-700 font-medium capitalize">
                  {option === 'all' ? 'Any' : option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8 px-4 md:px-0">
          <h3 className="font-bold text-slate-800 mb-4">Price Range (KES)</h3>
          <p className="text-xs text-slate-500 mb-2">Default currency is KES, but you can view USD equivalents via the top bar.</p>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-600 font-medium">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ minPrice: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 font-medium">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ maxPrice: parseInt(e.target.value) || 500000000 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Switch currency from the top bar to view USD equivalents.</p>
        </div>
      </motion.div>
    </>
  );
}
