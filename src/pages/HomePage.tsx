import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiGrid, FiMapPin, FiTrendingUp, FiUsers, FiArrowRight } from 'react-icons/fi';
import HeroCarousel from '../components/HeroCarousel';
import PropertyCard from '../components/PropertyCard';
import { useStore } from '../store/useStore';

export default function HomePage() {
  const { properties, realtors } = useStore();
  const featuredProperties = properties.filter((p) => p.isFeatured && p.isApproved).slice(0, 6);

  const categories = [
    { name: 'Apartment', icon: FiGrid, count: properties.filter(p => p.category === 'apartment').length, color: 'bg-blue-500' },
    { name: 'House', icon: FiHome, count: properties.filter(p => p.category === 'house').length, color: 'bg-green-500' },
    { name: 'Villa', icon: FiHome, count: properties.filter(p => p.category === 'villa').length, color: 'bg-purple-500' },
    { name: 'Commercial', icon: FiGrid, count: properties.filter(p => p.category === 'commercial').length, color: 'bg-orange-500' },
    { name: 'Land', icon: FiMapPin, count: properties.filter(p => p.category === 'land').length, color: 'bg-amber-600' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Categories Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Browse by Category
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Find your perfect property from our diverse range of categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/properties?category=${category.name.toLowerCase()}`}
                  className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group text-center"
                >
                  <div className={`${category.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-500">{category.count} Properties</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                Featured Properties
              </h2>
              <p className="text-slate-600">
                Handpicked properties for you
              </p>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 mt-4 md:mt-0"
            >
              View All Properties
              <FiArrowRight />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Property Collections */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Assorted Collections
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Explore trending listings, newest homes, verified listers, and best-value deals.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                title: 'Trending Properties',
                subtitle: 'Most viewed across Nairobi and Mombasa',
                items: properties.filter((p) => p.isFeatured).slice(0, 3),
              },
              {
                title: 'New Properties',
                subtitle: 'Recently added listings',
                items: [...properties].slice(0, 3),
              },
              {
                title: 'Verified Property Listers',
                subtitle: 'Trusted professionals with verified badges',
                items: properties.filter((p) => p.isListerVerified).slice(0, 3),
              },
              {
                title: 'Affordable Picks',
                subtitle: 'Best value listings under KES 10M',
                items: properties.filter((p) => p.price < 10000000).slice(0, 3),
              },
            ].map((group) => (
              <div key={group.title} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{group.title}</h3>
                    <p className="text-sm text-slate-500">{group.subtitle}</p>
                  </div>
                  <Link to="/properties" className="text-amber-600 text-sm font-semibold">
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {group.items.map((property) => (
                    <Link
                      key={property.id}
                      to={`/property/${property.id}`}
                      className="flex items-center gap-4 group"
                    >
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-20 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                          {property.title}
                        </p>
                        <p className="text-xs text-slate-500">{property.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-white grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-300">Verified Lister Boost</p>
              <p className="text-2xl font-bold">Golden Badge Visibility</p>
              <p className="text-xs text-slate-400 mt-2">Earn trust with document verification + KES 1,000 payment.</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">M-Pesa Unlock</p>
              <p className="text-2xl font-bold">KES 100 Contact Access</p>
              <p className="text-xs text-slate-400 mt-2">Phone, email & location remain private until payment.</p>
            </div>
            <div>
              <p className="text-sm text-slate-300">Urban Theme</p>
              <p className="text-2xl font-bold">Dynamic City Listings</p>
              <p className="text-xs text-slate-400 mt-2">Modern layouts with responsive filters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Nyumbani?
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              We make finding your dream property in Kenya easier than ever
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FiHome,
                title: 'Wide Selection',
                description: 'Access thousands of verified properties across Kenya',
              },
              {
                icon: FiTrendingUp,
                title: 'Best Prices',
                description: 'Find properties at competitive prices in the market',
              },
              {
                icon: FiUsers,
                title: 'Trusted Realtors',
                description: 'Work with verified and professional real estate agents',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Realtors */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Top Property Companies
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Partner with Kenya's leading real estate professionals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {realtors.map((realtor, index) => (
              <motion.div
                key={realtor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
              >
                <img
                  src={realtor.avatar}
                  alt={realtor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-slate-800 mb-1">{realtor.company}</h3>
                <p className="text-sm text-slate-500 mb-3">{realtor.properties} Properties</p>
                {realtor.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to List Your Property?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Reach thousands of potential buyers and renters. List your property today!
            </p>
            <Link
              to="/add-property"
              className="inline-block bg-white text-amber-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-colors"
            >
              List Your Property
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
