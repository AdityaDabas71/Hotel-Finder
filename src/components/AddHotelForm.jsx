import React, { useState } from 'react';
import { X } from 'lucide-react';

const CITIES = [
  'Ahmedabad', 'Bengaluru', 'Chennai', 'Delhi', 'Goa', 
  'Gurgaon', 'Hyderabad', 'Jaipur', 'Kolkata', 'Mumbai', 
  'Noida', 'Pune'
];

// Curated list of premium hotel image URLs for easy default listings
const DEFAULT_THUMBNAILS = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
];

export default function AddHotelForm({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Mumbai');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('4.5');
  const [description, setDescription] = useState('');
  
  // Choose a random default image to present to the user
  const randomImg = DEFAULT_THUMBNAILS[Math.floor(Math.random() * DEFAULT_THUMBNAILS.length)];
  const [thumbnail, setThumbnail] = useState(randomImg);
  const [photosInput, setPhotosInput] = useState(
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080, https://images.unsplash.com/photo-1505691938895-1758d7feb511?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) return alert('Please enter hotel name');
    if (!price || parseFloat(price) <= 0) return alert('Please enter a valid price');
    if (!rating || parseFloat(rating) < 1 || parseFloat(rating) > 5) return alert('Rating must be between 1.0 and 5.0');
    if (!description.trim()) return alert('Please enter description');

    // Parse comma-separated secondary photos
    const photos = photosInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url.startsWith('http'));

    const newHotel = {
      id: Date.now(), // Generate unique temp client-side ID
      name,
      location,
      price: parseFloat(price).toString(),
      rating: parseFloat(rating),
      description,
      thumbnail,
      photos
    };

    onSubmit(newHotel);
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} id="add-hotel-overlay">
      <div className="modal-content form-modal-content animate-fade-in" id="add-hotel-content">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 0 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>List Your Property</h2>
          <button 
            type="button" 
            style={{ border: '1px solid var(--border-medium)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifycontent: 'center' }} 
            onClick={onClose} 
            id="close-form-btn"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="add-hotel-form" id="add-hotel-form">
          <div className="input-block">
            <label htmlFor="hotel-name-input">Hotel / Property Name</label>
            <input 
              type="text" 
              id="hotel-name-input" 
              placeholder="e.g. Red Sands Boutique Resort" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-block">
              <label htmlFor="hotel-city-select">Location City</label>
              <select 
                id="hotel-city-select"
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                required
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="input-block">
              <label htmlFor="hotel-price-input">Price per Night (₹)</label>
              <input 
                type="number" 
                id="hotel-price-input" 
                placeholder="e.g. 4500" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="100"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-block">
              <label htmlFor="hotel-rating-input">Rating (1.0 - 5.0)</label>
              <input 
                type="number" 
                id="hotel-rating-input" 
                step="0.1" 
                min="1" 
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              />
            </div>

            <div className="input-block">
              <label htmlFor="hotel-thumbnail-input">Main Cover Image URL</label>
              <input 
                type="url" 
                id="hotel-thumbnail-input" 
                placeholder="https://..." 
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-block">
            <label htmlFor="hotel-gallery-input">Additional Gallery Image URLs (comma separated)</label>
            <input 
              type="text" 
              id="hotel-gallery-input" 
              placeholder="https://image1.jpg, https://image2.jpg" 
              value={photosInput}
              onChange={(e) => setPhotosInput(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="hotel-desc-input">Description</label>
            <textarea 
              id="hotel-desc-input" 
              rows="4" 
              placeholder="Describe your premium amenities, cozy rooms, spa, and neighborhood travel accessibility..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="add-hotel-submit-btn" id="submit-property-btn">
            List Property
          </button>
        </form>
      </div>
    </div>
  );
}
