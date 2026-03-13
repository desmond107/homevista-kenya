import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, properties, approveProperty, deleteProperty, adverts, addAdvert, deleteAdvert, users, realtors, categories, addCategory, deleteCategory } = useStore();
  const [activeTab, setActiveTab] = useState('properties');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '' });
  const [showAdvertForm, setShowAdvertForm] = useState(false);
  const [advertFormData, setAdvertFormData] = useState({ title: '', imageUrl: '', linkUrl: '' });

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <FiAlertCircle className="text-5xl text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-8">You don't have permission to access the admin panel.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const pendingProperties = properties.filter((p) => !p.isApproved);
  const approvedProperties = properties.filter((p) => p.isApproved);

  const handleApprove = (id: string) => {
    approveProperty(id);
    toast.success('Property approved!');
  };

  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Delete this property?')) {
      deleteProperty(id);
      toast.success('Property deleted');
    }
  };

  const handleAddAdvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertFormData.title || !advertFormData.imageUrl) {
      toast.error('Please fill in all fields');
      return;
    }

    const newAdvert = {
      id: `advert_${Date.now()}`,
      title: advertFormData.title,
      imageUrl: advertFormData.imageUrl,
      linkUrl: advertFormData.linkUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    addAdvert(newAdvert);
    setAdvertFormData({ title: '', imageUrl: '', linkUrl: '' });
    setShowAdvertForm(false);
    toast.success('Advert added successfully!');
  };

  const handleDeleteAdvert = (id: string) => {
    if (window.confirm('Delete this advert?')) {
      deleteAdvert(id);
      toast.success('Advert deleted');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name) {
      toast.error('Please provide a category name');
      return;
    }

    addCategory({
      id: `cat_${Date.now()}`,
      name: categoryFormData.name,
      description: categoryFormData.description,
      icon: 'building',
    });

    setCategoryFormData({ name: '', description: '' });
    setShowCategoryForm(false);
    toast.success('Category added');
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Delete this category?')) {
      deleteCategory(id);
      toast.success('Category deleted');
    }
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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Panel</h1>
          <p className="text-slate-600">Manage properties, adverts, and users</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-slate-600 mb-1">Total Properties</p>
            <p className="text-3xl font-bold text-slate-800">{properties.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-slate-600 mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-orange-600">{pendingProperties.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-slate-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-slate-600 mb-1">Active Adverts</p>
            <p className="text-3xl font-bold text-green-600">{adverts.filter((a) => a.isActive).length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['properties', 'adverts', 'users', 'realtors', 'categories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Pending Section */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FiAlertCircle className="text-orange-600" />
                Pending Approval ({pendingProperties.length})
              </h2>
              {pendingProperties.length > 0 ? (
                <div className="space-y-4">
                  {pendingProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <h3 className="font-bold text-slate-800">{property.title}</h3>
                          <p className="text-sm text-slate-600">{property.location}</p>
                          <p className="text-amber-600 font-bold mt-2">
                            KES {property.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(property.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors font-semibold"
                          >
                            <FiCheckCircle />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-semibold"
                          >
                            <FiX />
                            Reject
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <p className="text-slate-600">No pending properties</p>
                </div>
              )}
            </div>

            {/* Approved Section */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />
                Approved ({approvedProperties.length})
              </h2>
              {approvedProperties.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {approvedProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-slate-800 mb-1">{property.title}</h3>
                        <p className="text-sm text-slate-600 mb-3">{property.location}</p>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-semibold"
                        >
                          <FiTrash2 />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <p className="text-slate-600">No approved properties</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Adverts Tab */}
        {activeTab === 'adverts' && (
          <div>
            <button
              onClick={() => setShowAdvertForm(!showAdvertForm)}
              className="mb-6 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <FiPlus />
              Add New Advert
            </button>

            {showAdvertForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg mb-6"
              >
                <form onSubmit={handleAddAdvert} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={advertFormData.title}
                      onChange={(e) => setAdvertFormData({ ...advertFormData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={advertFormData.imageUrl}
                      onChange={(e) => setAdvertFormData({ ...advertFormData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Link URL</label>
                    <input
                      type="url"
                      value={advertFormData.linkUrl}
                      onChange={(e) => setAdvertFormData({ ...advertFormData, linkUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Create Advert
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdvertForm(false)}
                      className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {adverts.map((advert) => (
                <motion.div
                  key={advert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg"
                >
                  <img
                    src={advert.imageUrl}
                    alt={advert.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 mb-2">{advert.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${advert.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {advert.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleDeleteAdvert(advert.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-800">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-800">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-800">Role</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-3">{u.name}</td>
                    <td className="px-6 py-3">{u.email}</td>
                    <td className="px-6 py-3 capitalize">{u.role}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${u.isPremium ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                        {u.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Realtors Tab */}
        {activeTab === 'realtors' && (
          <div className="grid md:grid-cols-3 gap-6">
            {realtors.map((realtor) => (
              <motion.div
                key={realtor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <img
                  src={realtor.avatar}
                  alt={realtor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-slate-800 mb-1">{realtor.company}</h3>
                <p className="text-sm text-slate-600 mb-3">{realtor.properties} Properties</p>
                {realtor.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="mb-6 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <FiPlus />
              Add Category
            </button>

            {showCategoryForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg mb-6"
              >
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Create Category
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{category.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{category.description}</p>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-semibold"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
