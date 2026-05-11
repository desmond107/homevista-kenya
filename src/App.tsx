import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PopupAdvert from './components/PopupAdvert';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import RealtorsPage from './pages/RealtorsPage';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { fetchProfile } from './lib/db';
import { useStore } from './store/useStore';

function App() {
  const { login, logout, loadUserData, loadAdminData, initialize } = useStore();

  useEffect(() => {
    // Load public data (properties, adverts, realtors, categories)
    initialize();

    if (!isSupabaseConfigured) return;

    // Restore existing session on page load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const profile = await fetchProfile(session.user.id);
      if (!profile) return;
      login(profile);
      await loadUserData(session.user.id);
      if (profile.role === 'admin') await loadAdminData();
    });

    // Keep auth state in sync with Supabase session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const profile = await fetchProfile(session.user.id);
          if (!profile) return;
          login(profile);
          await loadUserData(session.user.id);
          if (profile.role === 'admin') await loadAdminData();
        } else if (event === 'SIGNED_OUT') {
          logout();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
