import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PopupAdvert from './components/PopupAdvert';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import RealtorsPage from './pages/RealtorsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/add-property" element={<AddPropertyPage />} />
            <Route path="/edit-property/:id" element={<EditPropertyPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/realtors" element={<RealtorsPage />} />
          </Routes>
        </main>
        <Footer />
        <PopupAdvert />
        <WhatsAppButton />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
