import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import SearchHero from './components/SearchHero';
import HotelGrid from './components/HotelGrid';
import HotelDetailModal from './components/HotelDetailModal';
import AddHotelForm from './components/AddHotelForm';
import Login from './pages/Login';
import Register from './pages/Register';
import useFetchHotels from './hooks/useFetchHotels';
import { ShieldCheck } from 'lucide-react';
import { AuthContext } from './context/AuthContext';

function HotelFinderHome({ 
  filters, 
  setFilters, 
  hotels, 
  totalCount, 
  loading, 
  error, 
  selectedHotel, 
  setSelectedHotel, 
  isAddHotelOpen, 
  setIsAddHotelOpen, 
  handleAddHotel, 
  handleBookingSuccess,
  handleListPropertyClick
}) {
  return (
    <>
      {/* Hero & Search bar */}
      <main style={{ flex: 1 }}>
        <SearchHero 
          filters={filters} 
          onFilterChange={setFilters} 
        />

        {/* Results grid container */}
        <HotelGrid
          hotels={hotels}
          totalCount={totalCount}
          loading={loading}
          error={error}
          filters={filters}
          onFilterChange={setFilters}
          onHotelClick={setSelectedHotel}
        />
      </main>

      {/* Modals & Overlays */}
      {selectedHotel && (
        <HotelDetailModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {isAddHotelOpen && (
        <AddHotelForm
          onClose={() => setIsAddHotelOpen(false)}
          onSubmit={handleAddHotel}
        />
      )}
    </>
  );
}

function MainAppContent() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Filter state configuration
  const [filters, setFilters] = useState({
    location: '',
    search: '',
    min_price: '',
    max_price: '',
    min_rating: '',
    max_rating: '',
    order_by: '-rating', // default sorting: highest rated first
    limit: 12,
    skip: 0
  });

  // 2. Persistent Client State for local hotel listings (syncs with localStorage)
  const [localHotels, setLocalHotels] = useState(() => {
    const saved = localStorage.getItem('stayred_local_hotels');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('stayred_local_hotels', JSON.stringify(localHotels));
  }, [localHotels]);

  // 3. Trigger API data fetching hook
  const { hotels, totalCount, loading, error } = useFetchHotels(filters, localHotels);

  // 4. Modal visual triggers
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);

  // 5. Success Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Add new property locally (and attempts API write)
  const handleAddHotel = (newHotel) => {
    if (!isAuthenticated) {
      showToast('Please sign in to list your property.', 'error');
      navigate('/login');
      return;
    }
    setLocalHotels(prev => [newHotel, ...prev]);
    setIsAddHotelOpen(false);
    showToast(`Successfully listed your property "${newHotel.name}"!`);
  };

  // Handle simulated bookings
  const handleBookingSuccess = (bookingDetails) => {
    if (!isAuthenticated) {
      setSelectedHotel(null);
      showToast('Please sign in first to reserve a stay.', 'error');
      navigate('/login');
      return;
    }
    setSelectedHotel(null);
    const priceFormatted = parseFloat(bookingDetails.grandTotal).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    showToast(
      `Booking Confirmed! ${bookingDetails.hotelName} reserved for ${bookingDetails.nights} night(s). Total stay: ${priceFormatted}.`
    );
  };

  const handleListPropertyClick = () => {
    if (!isAuthenticated) {
      showToast('Please sign in first to list your property.', 'error');
      navigate('/login');
    } else {
      setIsAddHotelOpen(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Toast Notification Container */}
      {toast && (
        <div 
          className="toast-notification" 
          id="app-toast"
          style={{
            backgroundColor: toast.type === 'error' ? 'var(--primary-dark)' : '#2b2b2b',
            zIndex: 9999
          }}
        >
          <div className="toast-icon" style={{ backgroundColor: toast.type === 'error' ? '#ffccd3' : '#4ade80' }}>
            {toast.type === 'error' ? '!' : '✓'}
          </div>
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{toast.message}</span>
        </div>
      )}

      {/* Header section */}
      <Header onAddHotelClick={handleListPropertyClick} />

      {/* Routes Switch */}
      <Routes>
        <Route 
          path="/" 
          element={
            <HotelFinderHome 
              filters={filters}
              setFilters={setFilters}
              hotels={hotels}
              totalCount={totalCount}
              loading={loading}
              error={error}
              selectedHotel={selectedHotel}
              setSelectedHotel={setSelectedHotel}
              isAddHotelOpen={isAddHotelOpen}
              setIsAddHotelOpen={setIsAddHotelOpen}
              handleAddHotel={handleAddHotel}
              handleBookingSuccess={handleBookingSuccess}
              handleListPropertyClick={handleListPropertyClick}
            />
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer Section */}
      <footer className="app-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <ShieldCheck size={24} />
                StayRed
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Your premium destination helper. Find, filter, and experience standard-setting hotel stays.
              </p>
            </div>
            
            <div className="footer-col">
              <h4>Destinations</h4>
              <div className="footer-links">
                <a href="#" onClick={(e) => { e.preventDefault(); setFilters(f => ({ ...f, location: 'Goa', skip: 0 })); }}>Goa</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setFilters(f => ({ ...f, location: 'Mumbai', skip: 0 })); }}>Mumbai</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setFilters(f => ({ ...f, location: 'Delhi', skip: 0 })); }}>Delhi</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setFilters(f => ({ ...f, location: 'Bengaluru', skip: 0 })); }}>Bengaluru</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>About</h4>
              <div className="footer-links">
                <a href="#">How it works</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
                <a href="#">Policies</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} StayRed Inc. All rights reserved.</p>
            <p style={{ display: 'flex', gap: '24px' }}>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Sitemap</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainAppContent />
    </BrowserRouter>
  );
}
