import React from 'react';
import HotelCard from './HotelCard';
import { AlertCircle, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export default function HotelGrid({ 
  hotels, 
  totalCount, 
  loading, 
  error, 
  filters, 
  onFilterChange, 
  onHotelClick 
}) {
  const limit = parseInt(filters.limit || 12);
  const skip = parseInt(filters.skip || 0);
  
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handlePageChange = (direction) => {
    let newSkip = skip;
    if (direction === 'prev' && skip > 0) {
      newSkip = Math.max(0, skip - limit);
    } else if (direction === 'next' && (skip + limit) < totalCount) {
      newSkip = skip + limit;
    }
    
    onFilterChange({
      ...filters,
      skip: newSkip
    });

    // Scroll back to results top smoothly
    window.scrollTo({
      top: 380,
      behavior: 'smooth'
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      location: '',
      search: '',
      min_price: '',
      max_price: '',
      min_rating: '',
      max_rating: '',
      order_by: '-rating',
      limit: 12,
      skip: 0,
    });
  };

  // Render shimmer placeholders during loading
  if (loading) {
    return (
      <section className="results-section container" id="results-loading">
        <div className="results-meta">
          <div className="shimmer" style={{ width: '180px', height: '24px', borderRadius: '4px' }}></div>
        </div>
        <div className="hotel-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="hotel-card" style={{ cursor: 'default' }}>
              <div className="card-image-wrapper shimmer"></div>
              <div className="card-info" style={{ gap: '8px' }}>
                <div className="shimmer" style={{ width: '80%', height: '18px', borderRadius: '4px' }}></div>
                <div className="shimmer" style={{ width: '40%', height: '14px', borderRadius: '4px' }}></div>
                <div className="shimmer" style={{ width: '60%', height: '16px', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Render error message
  if (error) {
    return (
      <section className="results-section container" id="results-error">
        <div className="empty-state" style={{ borderColor: '#fed7d7', background: '#fff5f5' }}>
          <div className="empty-state-icon" style={{ background: '#feb2b2', color: '#c53030' }}>
            <AlertCircle size={32} />
          </div>
          <h3 style={{ color: '#9b2c2c' }}>Something went wrong</h3>
          <p>{error}</p>
          <button type="button" className="clear-filters-btn" onClick={handleResetFilters}>
            Try Resetting Filters
          </button>
        </div>
      </section>
    );
  }

  // Render empty state
  if (hotels.length === 0) {
    return (
      <section className="results-section container" id="results-empty">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Inbox size={32} />
          </div>
          <h3>No properties match your search</h3>
          <p>Try modifying your location pill, adjusting price limits, or resetting filters to see more results.</p>
          <button type="button" className="clear-filters-btn" onClick={handleResetFilters} id="reset-empty-btn">
            Clear all filters
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="results-section container" id="results-list">
      {/* Search statistics header */}
      <div className="results-meta">
        <h2 className="results-count">
          Showing <span>{hotels.length}</span> of <span>{totalCount}</span> properties
        </h2>
      </div>

      {/* Grid container */}
      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <HotelCard 
            key={hotel.id} 
            hotel={hotel} 
            onClick={onHotelClick} 
          />
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-container" id="pagination-controls">
          <button 
            type="button" 
            className="pagination-btn"
            onClick={() => handlePageChange('prev')}
            disabled={skip <= 0}
            title="Previous page"
            id="prev-page-btn"
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="pagination-info" id="pagination-page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button 
            type="button" 
            className="pagination-btn"
            onClick={() => handlePageChange('next')}
            disabled={(skip + limit) >= totalCount}
            title="Next page"
            id="next-page-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
