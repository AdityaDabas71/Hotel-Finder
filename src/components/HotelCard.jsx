import React from 'react';
import { Star, MapPin } from 'lucide-react';

export default function HotelCard({ hotel, onClick }) {
  // Format price neatly
  const formattedPrice = parseFloat(hotel.price).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'INR'
  });

  // Handle broken images gracefully
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  };

  return (
    <article 
      className="hotel-card animate-fade-in" 
      onClick={() => onClick(hotel)}
      id={`hotel-card-${hotel.id}`}
      title={`View details of ${hotel.name}`}
    >
      <div className="card-image-wrapper">
        <img 
          src={hotel.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'} 
          alt={hotel.name} 
          onError={handleImageError}
          loading="lazy"
        />
        <div className="card-badge">
          <MapPin size={12} />
          <span>{hotel.location}</span>
        </div>
      </div>

      <div className="card-info">
        <div className="card-header-row">
          <h3 className="card-title">{hotel.name}</h3>
          <div className="card-rating" id={`card-rating-${hotel.id}`}>
            <Star size={14} className="star-filled" style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
            <span>{parseFloat(hotel.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <p className="card-location">
          <span>Premium Stay in {hotel.location}</span>
        </p>

        <div className="card-price-row">
          <span className="card-price">{formattedPrice}</span>
          <span> / night</span>
        </div>
      </div>
    </article>
  );
}
