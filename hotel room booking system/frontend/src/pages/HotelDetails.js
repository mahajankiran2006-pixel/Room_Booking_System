import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './HotelDetails.css';

const HotelDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'price-asc',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || ''
  });

  useEffect(() => {
    fetchHotelAndRooms();
  }, [id, filters.category, filters.sortBy]);

  const fetchHotelAndRooms = async () => {
    try {
      const [hotelRes, roomsRes] = await Promise.all([
        axios.get(`/api/hotels/${id}`),
        axios.get(`/api/rooms/hotel/${id}`, { params: filters })
      ]);
      setHotel(hotelRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading hotel details</div>;
  if (!hotel) return <div className="error">Hotel not found</div>;

  const sampleReviews = [
    { name: 'Rahul Sharma', rating: 5, text: 'Excellent stay! The rooms were clean and the staff was very helpful.' },
    { name: 'Priya Patel', rating: 4, text: 'Great location and good amenities. Would definitely recommend.' },
    { name: 'Amit Kumar', rating: 5, text: 'Best hotel experience. Value for money and amazing service.' }
  ];

  return (
    <div className="hotel-details">
      <div className="container">
        <div className="image-gallery">
          <div className="main-image">
            <img src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} />
            <button className="view-all-photos">📷 View all photos</button>
          </div>
          <div className="gallery-sidebar">
            <div className="gallery-item">
              <img src={hotel.images?.[1] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'} alt="Room" />
            </div>
            <div className="gallery-item">
              <img src={hotel.images?.[2] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'} alt="Amenity" />
            </div>
          </div>
        </div>

        <div className="hotel-header">
          <div className="hotel-title-row">
            <div>
              <h1>{hotel.name}</h1>
              <p className="location">📍 {hotel.location}</p>
            </div>
            <div className="hotel-meta">
              <div className="rating-large">
                <div className="rating-badge-large">⭐ {hotel.rating || 4.5}</div>
                <div>
                  <div className="reviews-large">Excellent</div>
                  <div className="reviews-large">245 reviews</div>
                </div>
              </div>
            </div>
          </div>
          <p className="hotel-description">{hotel.description}</p>
        </div>

        <div className="amenities-section">
          <h2>Amenities</h2>
          <div className="amenities-grid">
            <div className="amenity-item">
              <span className="amenity-icon">📶</span>
              <span>Free WiFi</span>
            </div>
            <div className="amenity-item">
              <span className="amenity-icon">❄️</span>
              <span>Air Conditioning</span>
            </div>
            <div className="amenity-item">
              <span className="amenity-icon">🏊</span>
              <span>Swimming Pool</span>
            </div>
            <div className="amenity-item">
              <span className="amenity-icon">🍳</span>
              <span>Breakfast</span>
            </div>
            <div className="amenity-item">
              <span className="amenity-icon">🅿️</span>
              <span>Free Parking</span>
            </div>
            <div className="amenity-item">
              <span className="amenity-icon">💪</span>
              <span>Gym</span>
            </div>
            <div className="amenity-item">
              <span className="amenity-icon">🛎️</span>
              <span>Room Service</span>
            </div>
            <div className="amenity-item">
              <span className="amenity-icon">🔒</span>
              <span>Safe Deposit</span>
            </div>
          </div>
        </div>

        <div className="rooms-section">
          <h2>Available Rooms</h2>
          
          <div className="room-filters">
            <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
              <option value="">All Room Types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Premium">Premium</option>
            </select>
            <select value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})}>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="rooms-grid">
            {rooms.map(room => (
              <div key={room._id} className="room-card card">
                <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'} alt={room.category} />
                <div className="room-info">
                  <div>
                    <h3>{room.category} Room</h3>
                    <p className="room-capacity">👥 Up to {room.capacity} guests • Room #{room.roomNumber}</p>
                    <div className="amenities">
                      {room.amenities?.slice(0, 4).map((amenity, idx) => (
                        <span key={idx}>✓ {amenity}</span>
                      ))}
                    </div>
                  </div>
                  <div className="room-footer">
                    <div className="price-section">
                      <div>
                        <span className="price">₹{room.price}</span>
                        <span className="price-label">/night</span>
                      </div>
                    </div>
                    <Link to={`/booking/${room._id}?checkIn=${filters.checkIn}&checkOut=${filters.checkOut}`} className="btn btn-primary">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="no-results">
              <p>No rooms available for selected dates</p>
            </div>
          )}
        </div>

        <div className="reviews-section">
          <h2>Guest Reviews</h2>
          {sampleReviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="review-header">
                <span className="reviewer-name">{review.name}</span>
                <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
