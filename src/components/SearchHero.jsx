import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';

const CITIES = [
  'Ahmedabad', 'Bengaluru', 'Chennai', 'Delhi', 'Goa', 
  'Gurgaon', 'Hyderabad', 'Jaipur', 'Kolkata', 'Mumbai', 
  'Noida', 'Pune'
];

export default function SearchHero({ filters, onFilterChange }) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [cityInput, setCityInput] = useState(filters.location || '');

  // Submits text search & city dropdown
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({
      ...filters,
      search: searchInput,
      location: cityInput,
      skip: 0, // Reset to first page
    });
  };

  // Quick select via city pills
  const handleCityPillClick = (city) => {
    const newLocation = filters.location === city ? '' : city;
    setCityInput(newLocation);
    onFilterChange({
      ...filters,
      location: newLocation,
      skip: 0,
    });
  };

  // Handle advanced filter changes
  const handleAdvancedChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
      skip: 0,
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setCityInput('');
    onFilterChange({
      location: '',
      search: '',
      min_price: '',
      max_price: '',
      min_rating: '',
      max_rating: '',
      order_by: '-rating', // Default sort
      limit: 12,
      skip: 0,
    });
  };

  const activeFiltersCount = [
    filters.min_price,
    filters.max_price,
    filters.min_rating,
    filters.max_rating
  ].filter(val => val !== undefined && val !== null && val !== '').length;

  return (
    <section className="hero-section">
      <div className="container text-center">
        <h1 className="hero-title animate-fade-in">Find your next perfect stay</h1>
        <p className="hero-subtitle animate-fade-in">Explore premium hotels, resorts, and villas across India</p>

        {/* Search Capsule Bar */}
        <form onSubmit={handleSearchSubmit} className="search-capsule animate-fade-in" id="search-form">
          <div className="search-field">
            <label htmlFor="search-input">Where</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search hotel name or keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label htmlFor="city-select">Destination</label>
            <select
              id="city-select"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            >
              <option value="">All Destinations</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="search-submit-btn" id="search-submit-btn" title="Search stays">
            <Search size={20} />
          </button>
        </form>

        {/* Quick Location Pills */}
        <div className="city-pill-wrapper animate-fade-in">
          {CITIES.map((city) => {
            const isActive = filters.location.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                type="button"
                className={`city-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleCityPillClick(city)}
                id={`city-pill-${city.toLowerCase()}`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Toggle & Sort Bar */}
        <div className="filter-bar animate-fade-in">
          <div className="filter-controls-group">
            <button
              type="button"
              className={`filter-btn-outline ${isFiltersOpen ? 'active' : ''}`}
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              id="filter-toggle-btn"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span style={{
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: '800'
                }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 || filters.search || filters.location ? (
              <button
                type="button"
                className="filter-btn-outline"
                onClick={handleClearFilters}
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                id="clear-filters-btn"
              >
                <X size={14} />
                <span>Reset Filters</span>
              </button>
            ) : null}
          </div>

          <div className="sort-select-wrapper">
            <span>Sort by</span>
            <select
              className="sort-select"
              id="sort-select"
              value={filters.order_by || ''}
              onChange={(e) => handleAdvancedChange('order_by', e.target.value)}
            >
              <option value="-rating">Highest Rated</option>
              <option value="rating">Lowest Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {isFiltersOpen && (
          <div className="filters-panel" id="advanced-filters-panel">
            {/* Price Filter Group */}
            <div className="filter-group">
              <h4>Price Range (₹)</h4>
              <div className="range-inputs">
                <div className="range-box">
                  <span>Min Price</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_price || ''}
                    onChange={(e) => handleAdvancedChange('min_price', e.target.value)}
                    min="0"
                  />
                </div>
                <div className="range-box">
                  <span>Max Price</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_price || ''}
                    onChange={(e) => handleAdvancedChange('max_price', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter Group */}
            <div className="filter-group">
              <h4>Minimum Rating</h4>
              <div className="rating-stars-select">
                {[1, 2, 3, 4, 5].map((rating) => {
                  const isActive = parseInt(filters.min_rating) === rating;
                  return (
                    <button
                      key={rating}
                      type="button"
                      className={`star-rating-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleAdvancedChange('min_rating', isActive ? '' : rating.toString())}
                      id={`star-btn-${rating}`}
                      title={`${rating} Star and above`}
                    >
                      {rating}★
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
