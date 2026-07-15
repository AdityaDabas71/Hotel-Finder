import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Calendar, Users, Award, Shield, CheckCircle } from 'lucide-react';

export default function HotelDetailModal({ hotel, onClose, onBookingSuccess }) {
  const [activePhoto, setActivePhoto] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(0);

  // Set default active photo to hotel thumbnail when modal loads or hotel changes
  useEffect(() => {
    if (hotel) {
      setActivePhoto(hotel.thumbnail || '');
      
      // Default booking dates (today and tomorrow)
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      setCheckIn(today.toISOString().split('T')[0]);
      setCheckOut(tomorrow.toISOString().split('T')[0]);
      setNights(1);
    }
  }, [hotel]);

  // Recalculate nights whenever check-in or check-out dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut]);

  if (!hotel) return null;

  // Extract all photos: combining thumbnail + photos list
  const allPhotos = [
    hotel.thumbnail,
    ...(hotel.photos || [])
  ].filter(src => typeof src === 'string' && src.trim() !== '');

  // Booking calculations
  const pricePerNight = parseFloat(hotel.price || 0);
  const baseTotal = pricePerNight * nights;
  const serviceFee = baseTotal * 0.08; // 8% service charge
  const tax = baseTotal * 0.12; // 12% GST/Luxury stay tax
  const grandTotal = baseTotal + serviceFee + tax;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (nights <= 0) {
      alert('Please check in and check out dates. Checkout must be after checkin!');
      return;
    }
    
    // Simulate API booking submit
    onBookingSuccess({
      hotelName: hotel.name,
      grandTotal: grandTotal,
      nights: nights,
      guests: guests
    });
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} id="detail-modal-overlay">
      <div className="modal-content animate-fade-in" id="detail-modal-content">
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close details" id="close-modal-btn">
          <X size={20} />
        </button>

        {/* Gallery Section */}
        <div className="modal-gallery">
          <div className="gallery-grid">
            <div className="gallery-main">
              <img 
                src={activePhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'} 
                alt={`${hotel.name} view`}
                onError={handleImageError} 
              />
            </div>
            
            {allPhotos.length > 1 && (
              <div className="gallery-sidebar" id="gallery-thumbs">
                {allPhotos.slice(0, 3).map((photo, index) => (
                  <div 
                    key={index} 
                    className={`gallery-sidebar-thumb ${activePhoto === photo ? 'active' : ''}`}
                    onClick={() => setActivePhoto(photo)}
                    title="View this image"
                  >
                    <img src={photo} alt={`${hotel.name} gallery ${index}`} onError={handleImageError} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Info & Booking Body */}
        <div className="modal-body">
          {/* Left Column: Info */}
          <div className="modal-info">
            <div className="modal-header-info">
              <h2>{hotel.name}</h2>
              <div className="modal-subinfo">
                <div className="modal-rating">
                  <Star size={16} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
                  <span>{parseFloat(hotel.rating || 0).toFixed(1)} Stars</span>
                </div>
                <div className="modal-location">
                  <MapPin size={16} />
                  <span>{hotel.location}, India</span>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Special highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Award style={{ color: 'var(--primary)', flexShrink: 0 }} size={24} />
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Highly Rated Property</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Guests consistently praise the clean rooms and exceptional service at this location.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Shield style={{ color: 'var(--primary)', flexShrink: 0 }} size={24} />
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Free Cancellation</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cancel up to 24 hours before check-in for a full refund.</p>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Description */}
            <div>
              <h3 className="modal-desc-title">About this premium stay</h3>
              <p className="modal-desc-text">{hotel.description}</p>
            </div>

            {/* Reviews section placeholder */}
            <div className="divider"></div>
            <div>
              <h3 className="modal-desc-title">Guest Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                <div style={{ background: 'var(--bg-light)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Aarav H.</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>July 2026</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    "Beautifully maintained property. The staff was incredibly welcoming and local city tours organized by the hotel were wonderful!"
                  </p>
                </div>
                <div style={{ background: 'var(--bg-light)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Priya S.</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>June 2026</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    "Amazing value for money. Located close to the metro station. The room service was quick, clean towels and spotless sheets."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <div>
            <div className="booking-widget animate-fade-in" id="booking-calculator">
              <div className="booking-header">
                <div className="booking-price">
                  ₹{pricePerNight.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  <span> / night</span>
                </div>
                <div className="booking-rating-summary">
                  <Star size={14} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
                  <span>{parseFloat(hotel.rating || 0).toFixed(1)}</span>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="form-inputs-group">
                  <div className="form-input-box">
                    <label htmlFor="check-in">Check-In</label>
                    <input 
                      type="date" 
                      id="check-in"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="form-input-box">
                    <label htmlFor="check-out">Check-Out</label>
                    <input 
                      type="date" 
                      id="check-out"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-input-box">
                    <label htmlFor="guests-count">Guests</label>
                    <input 
                      type="number" 
                      id="guests-count"
                      min="1" 
                      max="8"
                      value={guests} 
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="booking-submit-btn" id="book-now-btn">
                  Reserve Stay
                </button>
              </form>

              {nights > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    You won't be charged yet
                  </p>

                  <div className="booking-charge-row">
                    <span>₹{pricePerNight.toLocaleString('en-IN', { maximumFractionDigits: 0 })} x {nights} nights</span>
                    <span>₹{baseTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>

                  <div className="booking-charge-row">
                    <span>StayRed service fee (8%)</span>
                    <span>₹{serviceFee.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>

                  <div className="booking-charge-row">
                    <span>Occupancy taxes & GST (12%)</span>
                    <span>₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>

                  <div className="booking-charge-total">
                    <span>Total before taxes</span>
                    <span>₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
