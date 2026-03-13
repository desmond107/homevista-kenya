import { Link } from 'react-router-dom';
import { FiHome, FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <FiHome className="text-xl text-white" />
              </div>
              <span className="text-xl font-bold text-white">HomeVista Kenya</span>
            </div>
            <p className="text-sm">
              Your trusted platform for buying, selling, and renting properties across Kenya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-amber-500 transition-colors">Properties</Link></li>
              <li><Link to="/realtors" className="hover:text-amber-500 transition-colors">Realtors</Link></li>
              <li><Link to="/add-property" className="hover:text-amber-500 transition-colors">List Property</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/properties?category=apartment" className="hover:text-amber-500 transition-colors">Apartments</Link></li>
              <li><Link to="/properties?category=house" className="hover:text-amber-500 transition-colors">Houses</Link></li>
              <li><Link to="/properties?category=villa" className="hover:text-amber-500 transition-colors">Villas</Link></li>
              <li><Link to="/properties?category=commercial" className="hover:text-amber-500 transition-colors">Commercial</Link></li>
              <li><Link to="/properties?category=land" className="hover:text-amber-500 transition-colors">Land</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-500 transition-colors">About Us:</a>0713905761</li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm">
            &copy; 2026 HomeVista Kenya. All rights reserved. | Kenya's Premier Real Estate Platform
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-500 transition-colors">
              <FiFacebook className="text-xl" />
            </a>
            <a href="#" className="hover:text-amber-500 transition-colors">
              <FiInstagram className="text-xl" />
            </a>
            <a href="#" className="hover:text-amber-500 transition-colors">
              <FiTwitter className="text-xl" />
            </a>
            <a href="#" className="hover:text-amber-500 transition-colors">
              <FiLinkedin className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
