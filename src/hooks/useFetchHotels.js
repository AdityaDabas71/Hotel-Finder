import { useState, useEffect } from 'react';
import { fetchHotels } from '../services/api';

/**
 * Custom hook to fetch hotels and merge them with locally created hotels.
 * @param {Object} filters - Active filter and search parameters.
 * @param {Array} localHotels - User-created hotels that exist only in client state.
 */
export default function useFetchHotels(filters, localHotels = []) {
  const [hotels, setHotels] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadHotels() {
      setLoading(true);
      setError(null);
      try {
        const responseData = await fetchHotels(filters);
        
        if (!active) return;

        // Parse API response
        let apiHotels = responseData.data || [];
        let apiCount = responseData.count || apiHotels.length;

        // Filter local hotels based on active query params to simulate database matching
        const filteredLocal = localHotels.filter(hotel => {
          // Location filter
          if (filters.location && hotel.location.toLowerCase() !== filters.location.toLowerCase()) {
            return false;
          }
          
          // Text search filter
          if (filters.search) {
            const query = filters.search.toLowerCase();
            const matchesName = hotel.name.toLowerCase().includes(query);
            const matchesLoc = hotel.location.toLowerCase().includes(query);
            if (!matchesName && !matchesLoc) return false;
          }

          // Price filters
          const price = parseFloat(hotel.price);
          if (filters.min_price && price < parseFloat(filters.min_price)) return false;
          if (filters.max_price && price > parseFloat(filters.max_price)) return false;

          // Rating filters
          const rating = parseFloat(hotel.rating);
          if (filters.min_rating && rating < parseFloat(filters.min_rating)) return false;
          if (filters.max_rating && rating > parseFloat(filters.max_rating)) return false;

          return true;
        });

        // Sort local hotels if order_by parameter is set
        if (filters.order_by) {
          const order = filters.order_by;
          filteredLocal.sort((a, b) => {
            if (order === 'price') return parseFloat(a.price) - parseFloat(b.price);
            if (order === '-price') return parseFloat(b.price) - parseFloat(a.price);
            if (order === 'rating') return parseFloat(a.rating) - parseFloat(b.rating);
            if (order === '-rating') return parseFloat(b.rating) - parseFloat(a.rating);
            if (order === 'name') return a.name.localeCompare(b.name);
            return 0;
          });
        }

        // Combine lists: prepend local hotels for visibility
        // For pagination simulation: if skip is 0, show them first
        const skipNum = parseInt(filters.skip || 0);
        const limitNum = parseInt(filters.limit || 12);
        
        let combinedList = [];
        if (skipNum === 0) {
          // Prepend local items on the first page
          combinedList = [...filteredLocal, ...apiHotels];
        } else {
          combinedList = [...apiHotels];
        }

        // Slice to limit size
        combinedList = combinedList.slice(0, limitNum);

        setHotels(combinedList);
        setTotalCount(apiCount + filteredLocal.length);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to fetch hotels. Please try again.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHotels();

    return () => {
      active = false;
    };
  }, [filters, localHotels]);

  return { hotels, totalCount, loading, error };
}
