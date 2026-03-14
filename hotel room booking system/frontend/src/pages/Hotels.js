import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Hotels.css';

const Hotels = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    priceRange: [0, 10000],
    rating: 0,
    amenities: [],
    sortBy: 'popularity'
  });

  useEffect(() => {
    fetchHotels();
  }, [filters.location]);

  useEffect(() => {
    if (allHotels.length > 0) {
      const filtered = applyFilters(allHotels);
      setHotels(filtered);
    }
  }, [filters.rating, filters.amenities, filters.sortBy, allHotels]);

  const fetchHotels = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      
      const { data } = await axios.get(`/api/hotels?${params}`);
      setAllHotels(data);
      setHotels(applyFilters(data));
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
    let filtered = [...data];
    
    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(h => (h.rating || 0) >= filters.rating);
    }
    
    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(h => {
        const hotelAmenities = h.amenities || [];
        return filters.amenities.every(amenity => 
          hotelAmenities.some(ha => ha.toLowerCase().includes(amenity.toLowerCase()))
        );
      });
    }
    
    // Apply sorting
    if (filters.sortBy === 'price-asc') {
      filtered.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    } else if (filters.sortBy === 'price-desc') {
      filtered.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
    } else if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    return filtered;
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (loading) return <div className="loading">Finding best hotels for you</div>;

  return (
    <div className="hotels-page">
      <div className="hotels-header">
        <div className="container">
          <h1>Find Your Perfect Stay</h1>
          <div className="search-filters">
            <input
              type="text"
              placeholder="🔍 Search by location"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
            <input
              type="date"
              placeholder="Check-in"
              value={filters.checkIn}
              onChange={(e) => setFilters({...filters, checkIn: e.target.value})}
            />
            <input
              type="date"
              placeholder="Check-out"
              value={filters.checkOut}
              onChange={(e) => setFilters({...filters, checkOut: e.target.value})}
            />
            <button className="btn btn-primary">Search</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hotels-content">
          <aside className="filters-sidebar">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                />
                <div className="price-display">
                  <span>₹0</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h4>Star Rating</h4>
              <div className="amenities-list">
                {[5, 4, 3, 2].map(star => (
                  <label key={star} className="amenity-checkbox">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === star}
                      onChange={() => setFilters({...filters, rating: star})}
                    />
                    <span>{'⭐'.repeat(star)} & above</span>
                  </label>
                ))}
                <label className="amenity-checkbox">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === 0}
                    onChange={() => setFilters({...filters, rating: 0})}
                  />
                  <span>All Ratings</span>
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Amenities</h4>
              <div className="amenities-list">
                {['WiFi', 'AC', 'Pool', 'Breakfast', 'Parking', 'Gym'].map(amenity => (
                  <label key={amenity} className="amenity-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="hotels-main">
            <div className="results-header">
              <p className="results-count">{hotels.length} properties found</p>
              <div className="sort-dropdown">
                <select value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})}>
                  <option value="popularity">Sort by Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
              </div>
            </div>

            <div className="hotels-grid">
              {hotels.map(hotel => (
                <Link to={`/hotels/${hotel._id}?checkIn=${filters.checkIn}&checkOut=${filters.checkOut}`} key={hotel._id} className="hotel-card card">
                  <div className="hotel-image">
                    <img src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} alt={hotel.name} />
                  </div>
                  <div className="hotel-info">
                    <div className="hotel-header">
                      <h3>{hotel.name}</h3>
                      <p className="location">📍 {hotel.location}</p>
                      <div className="rating-row">
                        <div className="rating-badge">
                          ⭐ {hotel.rating || 4.5}
                        </div>
                        <span className="reviews-count">(245 reviews)</span>
                      </div>
                      <div className="amenities-preview">
                        {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="amenity-tag">
                            {amenity === 'WiFi' && '📶'} 
                            {amenity === 'AC' && '❄️'} 
                            {amenity === 'Pool' && '🏊'} 
                            {amenity === 'Breakfast' && '🍳'} 
                            {amenity === 'Parking' && '🅿️'} 
                            {amenity === 'Gym' && '💪'} 
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="hotel-footer">
                      <div className="price-section">
                        <div>
                          <span className="current-price">₹2,799</span>
                          <span className="price-label">/night</span>
                        </div>
                      </div>
                      <div className="hotel-actions">
                        <button className="btn btn-secondary">View Details</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hotels.length === 0 && (
              <div className="no-results">
                <p>😔 No hotels found matching your criteria</p>
                <button className="btn btn-primary" onClick={() => setFilters({...filters, rating: 0, amenities: []})}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
