import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiPlus, FiX } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, properties, updateProperty } = useStore();
  const property = useMemo(() => properties.find((p) => p.id === id), [id, properties]);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(property?.images || []);
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price?.toString() || '',
    priceType: property?.priceType || 'sale',
    category: property?.category || 'apartment',
    listingType: property?.listingType || 'buy',
    location: property?.location || '',
    address: property?.address || '',
    bedrooms: property?.bedrooms?.toString() || '',
    bathrooms: property?.bathrooms?.toString() || '',
    area: property?.area?.toString() || '',
    features: property?.features || [],
    ownerPhone: property?.ownerPhone || '',
    ownerEmail: property?.ownerEmail || '',
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <FiAlertCircle className="text-5xl text-amber-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Login Required</h1>
        <p className="text-slate-600 mb-8">You need to be logged in to edit a property.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!property || property.userId !== user?.id) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <FiAlertCircle className="text-5xl text-amber-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Property Not Found</h1>
        <p className="text-slate-600 mb-8">We could not find a property to edit.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.ownerPhone || !formData.ownerEmail) {
      toast.error('Please provide lister phone and email');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setIsLoading(true);

    try {
      updateProperty(property.id, {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        priceType: formData.priceType,
        category: formData.category as any,
        listingType: formData.listingType as any,
        location: formData.location,
        address: formData.address,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        area: parseInt(formData.area || '0'),
        images,
        features: formData.features,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail,
        isApproved: false,
      });

      toast.success('Property updated! Awaiting admin review.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const amenityOptions = ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony', 'Air Conditioning', 'WiFi Ready'];

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Edit Property</h1>
          <p className="text-slate-600">Update your listing details</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Listing Type *</label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="buy">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="lease">For Lease</option>
                  <option value="sell">Selling</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Location</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Pricing</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (KES) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price Type</label>
                <select
                  value={formData.priceType}
                  onChange={(e) => setFormData({ ...formData, priceType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="sale">Total Sale Price</option>
                  <option value="monthly">Monthly Rent</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Property Details</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Area (m²) *</label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Lister Contact (Hidden until M-Pesa payment)</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Amenities</h2>
            <div className="grid md:grid-cols-4 gap-3">
              {amenityOptions.map((amenity) => (
                <label key={amenity} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(amenity)}
                    onChange={() => handleFeatureToggle(amenity)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="ml-2 text-slate-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Images (Max 10)</h2>
            <div className="mb-6">
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg p-8 cursor-pointer hover:border-amber-500 transition-colors">
                <FiPlus className="text-2xl text-slate-400" />
                <span className="text-slate-600">Click to upload or drag and drop</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating Property...' : 'Update Property'}
          </button>
        </form>
      </div>
    </div>
  );
}
