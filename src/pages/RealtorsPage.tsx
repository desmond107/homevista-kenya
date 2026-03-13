import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiCheckCircle } from 'react-icons/fi';
import { useStore } from '../store/useStore';

export default function RealtorsPage() {
  const { realtors } = useStore();

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Property Companies</h1>
          <p className="text-xl text-slate-300">Connect with verified real estate professionals</p>
        </div>
      </div>

      {/* Realtors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {realtors.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {realtors.map((realtor, index) => (
              <motion.div
                key={realtor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
              >
                {/* Background */}
                <div className="h-32 bg-gradient-to-r from-amber-500 to-orange-600"></div>

                {/* Avatar */}
                <div className="px-6 py-8">
                  <div className="flex justify-center -mt-16 mb-4">
                    <img
                      src={realtor.avatar}
                      alt={realtor.company}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                    />
                  </div>

                  {/* Info */}
                  <h3 className="text-2xl font-bold text-slate-800 text-center mb-1">
                    {realtor.company}
                  </h3>
                  {realtor.name && (
                    <p className="text-slate-600 text-center text-sm mb-4">{realtor.name}</p>
                  )}

                  {/* Verification Badge */}
                  {realtor.isVerified && (
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
                        <FiCheckCircle />
                        Verified Professional
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <p className="text-center">
                      <span className="text-3xl font-bold text-amber-600">{realtor.properties}</span>
                      <span className="text-slate-600 text-sm"> Active Properties</span>
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <FiPhone className="text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-600">Phone</p>
                        <a
                          href={`tel:${realtor.phone}`}
                          className="text-slate-800 font-semibold hover:text-amber-600 transition-colors"
                        >
                          {realtor.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <FiMail className="text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-600">Email</p>
                        <a
                          href={`mailto:${realtor.email}`}
                          className="text-slate-800 font-semibold hover:text-amber-600 transition-colors text-sm"
                        >
                          {realtor.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${realtor.phone}`}
                      className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      <FiPhone className="text-sm" />
                      Call
                    </a>
                    <a
                      href={`mailto:${realtor.email}`}
                      className="flex items-center justify-center gap-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      <FiMail className="text-sm" />
                      Email
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">No realtors available at the moment</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Become a Verified Realtor
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            List your properties on Nyumbani and reach thousands of potential buyers and renters across Kenya
          </p>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg transition-all">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
