const API_BASE_URL = 'https://demohotelsapi.pythonanywhere.com/hotels/';

/**
 * Fetches hotels from the API with options
 * @param {Object} params - Search/filter options
 * @param {string} params.location - Filter by city (exact or icontains)
 * @param {string} params.search - Filter by name/location query
 * @param {number|string} params.min_price - Minimum price filter
 * @param {number|string} params.max_price - Maximum price filter
 * @param {number|string} params.min_rating - Minimum rating filter
 * @param {number|string} params.max_rating - Maximum rating filter
 * @param {string} params.order_by - Field to sort by (e.g. 'price', '-price', 'rating', '-rating')
 * @param {number} params.limit - Limit for pagination
 * @param {number} params.skip - Offset for pagination
 */
export async function fetchHotels(params = {}) {
  const url = new URL(API_BASE_URL);

  // Clean and add search parameters
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
}

/**
 * Fetches a single hotel by its unique ID
 * @param {number|string} id - Hotel ID
 */
export async function fetchHotelById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}${id}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching hotel with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Creates a new hotel record
 * @param {Object} hotelData - The hotel fields to save
 */
export async function createHotel(hotelData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hotelData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating hotel:', error);
    throw error;
  }
}
