import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  amount?: number;
}

export default function MpesaModal({ isOpen, onClose, propertyId, amount = 100 }: MpesaModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('+254');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addPayment, addPaidProperty } = useStore();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);

    // Simulate M-Pesa STK prompt
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create payment record
      const payment = {
        id: `payment_${Date.now()}`,
        userId: `user_${Date.now()}`,
        propertyId,
        amount,
        status: 'completed' as const,
        mpesaRef: `REF${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      addPayment(payment);
      addPaidProperty(propertyId);

      setIsSuccess(true);
      toast.success('Payment successful! Contact details unlocked.');

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setPhoneNumber('+254');
      }, 2000);
    } catch {
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <FiX className="text-2xl" />
            </button>

            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-800">Unlock Contact Info</h2>
                  <p className="text-slate-600 mt-1">Pay via M-Pesa Express STK prompt</p>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Amount Display */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 text-white mb-6 text-center">
                    <p className="text-sm opacity-90">Amount to Pay</p>
                    <p className="text-3xl font-bold">KES {amount.toLocaleString()}</p>
                    <p className="text-xs opacity-90">Unlock lister details via M-Pesa Express</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        M-Pesa Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+254712345678"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        You will receive an M-Pesa STK prompt on this number
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        'Proceed to Payment'
                      )}
                    </button>
                  </form>

                  {/* Info */}
                  <div className="bg-blue-50 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">Note:</span> You will receive an M-Pesa STK prompt. Enter your PIN to complete the payment and unlock the contact details.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex justify-center mb-4"
                >
                  <FiCheckCircle className="text-5xl text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
                <p className="text-slate-600 mb-4">
                  You can now view the contact details and location of the property lister.
                </p>
                <div className="bg-green-50 rounded-lg p-3 text-sm text-green-700">
                  <p><span className="font-semibold">Transaction ID:</span> REF{Date.now()}</p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
