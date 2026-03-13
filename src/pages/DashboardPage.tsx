import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiPlus, FiEdit2, FiTrash2, FiEye, FiAlertCircle, FiCheckCircle, FiShield } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import VerifyListerModal from '../components/VerifyListerModal';
import PropertyCard from '../components/PropertyCard';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, properties, deleteProperty, logout } = useStore();
  const [activeTab, setActiveTab] = useState('properties');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <FiAlertCircle className="text-5xl text-amber-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Login Required</h1>
        <p className="text-slate-600 mb-8">You need to be logged in to access your dashboard.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const userProperties = properties.filter((p) => p.userId === user?.id);
  const approvedProperties = userProperties.filter((p) => p.isApproved);
  const pendingProperties = userProperties.filter((p) => !p.isApproved);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
      toast.success('Property deleted successfully');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">My Dashboard</h1>
              <p className="text-slate-600">Manage your properties and listings</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/add-property')}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                <FiPlus />
                List Property
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
                <p className="text-slate-600">{user?.email}</p>
                {user?.company && <p className="text-slate-600">{user.company}</p>}
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">{userProperties.length}</p>
                  <p className="text-sm text-slate-600">Total Properties</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{approvedProperties.length}</p>
                  <p className="text-sm text-slate-600">Published</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{pendingProperties.length}</p>
                  <p className="text-sm text-slate-600">Drafts</p>
                </div>
                <div className="text-center">
                  {user?.isVerifiedLister ? (
                    <p className="text-sm font-semibold text-white bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 rounded-full shadow">
                      Verified Property Lister
                    </p>
                  ) : (
                    <button
                      onClick={() => { setShowVerifyModal(true); setShowVerificationForm(true); }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-amber-600"
                    >
                      <FiShield />
                      Apply for Verified Badge
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {user?.role === 'lister' && !user?.isVerifiedLister && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-amber-800 mb-2">Get Verified & Boost Trust</h3>
            <p className="text-sm text-amber-700 mb-4">
              Submit your ID, personal photo, property certificate, and proof of ownership. Pay KES 1,000 via M-Pesa, Visa, or Mastercard to receive the golden verified badge.
            </p>
            <button
              onClick={() => setShowVerifyModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Start Verification
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'properties'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Properties ({userProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Approved ({approvedProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Pending ({pendingProperties.length})
          </button>
        </div>

        {/* Properties List */}
        {activeTab === 'properties' && userProperties.length > 0 && (
          <div className="space-y-6">
            {userProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="grid md:grid-cols-4 gap-6 p-6">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <img
                      src={property.images[0] || 'https://via.placeholder.com/300'}
                      alt={property.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2">
                    <div className="flex gap-2 mb-3">
                      {property.isApproved ? (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                          <FiCheckCircle />
                          Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded">
                          <FiAlertCircle />
                          Pending
                        </span>
                      )}
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded capitalize">
                        {property.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{property.title}</h3>
                    <p className="text-slate-600 text-sm mb-2">{property.location}</p>
                    <p className="text-2xl font-bold text-amber-600">
                      KES {property.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors font-semibold"
                    >
                      <FiEye />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/edit-property/${property.id}`)}
                      className="flex items-center justify-center gap-2 bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors font-semibold"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-semibold"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="grid md:grid-cols-3 gap-6">
            {approvedProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
            {approvedProperties.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600">No approved properties yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="grid md:grid-cols-3 gap-6">
            {pendingProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
            {pendingProperties.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600">No pending properties</p>
              </div>
            )}
          </div>
        )}
      </div>

      <VerifyListerModal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
    </div>
  );
}
