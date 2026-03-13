import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

interface VerifyListerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerifyListerModal({ isOpen, onClose }: VerifyListerModalProps) {
  const { user, addVerificationRequest, updateUser } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'visa' | 'mastercard'>('mpesa');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [details, setDetails] = useState({
    fullName: user?.name || '',
    idNumber: '',
    location: '',
  });
  const [documents, setDocuments] = useState({
    idDocument: '',
    profilePhoto: '',
    proofDocument: '',
    propertyCertificate: '',
  });

  const handleFile = (field: keyof typeof documents, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDocuments((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!details.fullName || !details.idNumber || !details.location) {
      toast.error('Please fill in all required details');
      return;
    }

    if (!documents.idDocument || !documents.profilePhoto || !documents.proofDocument || !documents.propertyCertificate) {
      toast.error('Please upload all verification documents');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Please accept the terms & conditions');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const request = {
        id: `verify_${Date.now()}`,
        userId: user?.id || 'user_0',
        fullName: details.fullName,
        idNumber: details.idNumber,
        location: details.location,
        documents,
        status: 'pending' as const,
        paymentMethod,
        amount: 1000,
        acceptedTerms,
        createdAt: new Date().toISOString(),
      };

      addVerificationRequest(request);

      updateUser(user?.id || 'user_0', {
        isVerifiedLister: true,
      });

      toast.success('Verification submitted! You are now a verified property lister.');
      onClose();
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <FiX className="text-2xl" />
            </button>

            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Verify Property Lister</h2>
              <p className="text-slate-600 mt-1">
                Submit your ID, personal photo, property certificate, and proof of realtor or ownership.
                Pay KES 1,000 via M-Pesa, Visa, or Mastercard to earn the golden "Verified Property Lister" badge.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-3 grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={details.fullName}
                      onChange={(e) => setDetails((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">ID Number</label>
                    <input
                      type="text"
                      value={details.idNumber}
                      onChange={(e) => setDetails((prev) => ({ ...prev, idNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={details.location}
                      onChange={(e) => setDetails((prev) => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {[
                  { label: 'National ID / Passport', field: 'idDocument' },
                  { label: 'Personal Photo', field: 'profilePhoto' },
                  { label: 'Realtor Proof Document', field: 'proofDocument' },
                  { label: 'Property Certificate', field: 'propertyCertificate' },
                ].map((item) => (
                  <label
                    key={item.field}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-amber-500 transition-colors"
                  >
                    <FiUploadCloud className="text-2xl text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500">Upload document</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFile(item.field as keyof typeof documents, e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  I confirm that the above details are accurate and accept the terms & conditions.
                </label>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Select Payment Method</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {([
                    { value: 'mpesa', label: 'M-Pesa STK' },
                    { value: 'visa', label: 'Visa Card' },
                    { value: 'mastercard', label: 'Mastercard' },
                  ] as const).map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                        paymentMethod === method.value
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 text-white flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Verification Fee</p>
                  <p className="text-2xl font-bold">KES 1,000</p>
                  <p className="text-xs opacity-90">Pay via M-Pesa, Visa, or Mastercard</p>
                </div>
                <FiCheckCircle className="text-3xl" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application & Pay KES 1,000'}
              </button>

              <p className="text-xs text-slate-500 text-center">
                Verification applications are reviewed within 24 hours.
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
