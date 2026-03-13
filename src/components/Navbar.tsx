import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiPlus, FiSettings, FiDollarSign } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, currency, setCurrency, exchangeRate, setExchangeRate } = useStore();
  const navigate = useNavigate();

  const toggleCurrency = () => {
    setCurrency(currency === 'KES' ? 'USD' : 'KES');
  };

  const handleExchangeRate = (value: number) => {
    if (Number.isNaN(value) || value <= 0) return;
    setExchangeRate(value);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <FiHome className="text-2xl" />
              </div>
              <span className="text-xl font-bold">HomeVista Kenya</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
              <Link to="/properties" className="hover:text-amber-500 transition-colors">Properties</Link>
              <Link to="/properties?type=buy" className="hover:text-amber-500 transition-colors">Buy</Link>
              <Link to="/properties?type=rent" className="hover:text-amber-500 transition-colors">Rent</Link>
              <Link to="/properties?type=lease" className="hover:text-amber-500 transition-colors">Lease</Link>
              <Link to="/realtors" className="hover:text-amber-500 transition-colors">Realtors</Link>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="hidden lg:flex items-center gap-2 border border-slate-700 rounded-lg px-3 py-1.5">
                <FiDollarSign className="text-slate-300" />
                <span className="text-xs text-slate-400">1 USD</span>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => handleExchangeRate(parseFloat(e.target.value))}
                  className="w-20 bg-transparent text-xs text-slate-200 focus:outline-none"
                />
                <span className="text-xs text-slate-400">KES</span>
              </div>
              <button
                onClick={toggleCurrency}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-amber-500 transition-colors"
              >
                <FiDollarSign />
                <span className="text-sm font-semibold">{currency}</span>
              </button>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 hover:text-amber-500 transition-colors"
                  >
                    <img
                      src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user?.name}</span>
                    <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full capitalize">
                      {user?.role === 'viewer' ? 'Viewer' : user?.role}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
                      >
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FiUser />
                          <span>My Dashboard</span>
                        </Link>
                        <Link
                          to="/add-property"
                          className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FiPlus />
                          <span>Add Property</span>
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FiSettings />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-slate-100 w-full"
                        >
                          <FiLogOut />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-amber-500 hover:bg-amber-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-800"
            >
              <div className="px-4 py-4 space-y-3">
                <Link to="/" className="block py-2 hover:text-amber-500" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/properties" className="block py-2 hover:text-amber-500" onClick={() => setIsOpen(false)}>Properties</Link>
                <Link to="/properties?type=buy" className="block py-2 hover:text-amber-500" onClick={() => setIsOpen(false)}>Buy</Link>
                <Link to="/properties?type=rent" className="block py-2 hover:text-amber-500" onClick={() => setIsOpen(false)}>Rent</Link>
                <Link to="/properties?type=lease" className="block py-2 hover:text-amber-500" onClick={() => setIsOpen(false)}>Lease</Link>
                <Link to="/realtors" className="block py-2 hover:text-amber-500" onClick={() => setIsOpen(false)}>Realtors</Link>
                
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="block py-2 hover:text-amber-500" onClick={() => setIsOpen(false)}>My Dashboard</Link>
                    <Link to="/add-property" className="block py-2 hover:text-amber-500" onClick={() => setIsOpen(false)}>Add Property</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block py-2 hover:text-amber-500" onClick={() => setIsOpen(false)}>Admin Panel</Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="block py-2 text-red-400"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setShowAuthModal(true); setIsOpen(false); }}
                    className="w-full bg-amber-500 hover:bg-amber-600 px-6 py-2 rounded-lg font-semibold"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
