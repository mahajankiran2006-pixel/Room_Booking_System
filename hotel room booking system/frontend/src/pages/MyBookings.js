import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/my-bookings');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Refund will be processed within 5-7 business days.')) return;
    
    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully! Refund initiated.');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleDownloadInvoice = (bookingId) => {
    toast.info('Invoice download will be available soon');
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.bookingStatus === activeTab;
  });

  if (loading) return <div className="loading">Loading your bookings</div>;

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1>My Bookings</h1>
        
        <div className="bookings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
            onClick={() => setActiveTab('confirmed')}
          >
            Upcoming
          </button>
          <button 
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">🏨</div>
            <p>No bookings found in this category</p>
            <Link to="/hotels" className="btn btn-primary">
              Explore Hotels
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="booking-card card">
                <div className="booking-image">
                  <img 
                    src={booking.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} 
                    alt={booking.hotel?.name} 
                  />
                </div>
                <div className="booking-content">
                  <div className="booking-header">
                    <div>
                      <h3>{booking.hotel?.name}</h3>
                      <p className="booking-id">Booking ID: {booking._id.substring(0, 12).toUpperCase()}</p>
                    </div>
                    <span className={`status ${booking.bookingStatus}`}>
                      {booking.bookingStatus}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="detail-label">Room Type</span>
                      <span className="detail-value">{booking.room?.category} - #{booking.room?.roomNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Check-in</span>
                      <span className="detail-value">{new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Check-out</span>
                      <span className="detail-value">{new Date(booking.checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Guests</span>
                      <span className="detail-value">{booking.guests.adults} Adults, {booking.guests.children} Children</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value" style={{color: 'var(--primary-red)'}}>₹{booking.totalAmount}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Status</span>
                      <span className="detail-value">{booking.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    {booking.bookingStatus === 'confirmed' && (
                      <>
                        <button onClick={() => handleCancel(booking._id)} className="btn btn-danger">
                          Cancel Booking
                        </button>
                        <button onClick={() => handleDownloadInvoice(booking._id)} className="btn btn-outline">
                          Download Invoice
                        </button>
                      </>
                    )}
                    {booking.bookingStatus === 'completed' && (
                      <>
                        <button onClick={() => handleDownloadInvoice(booking._id)} className="btn btn-outline">
                          Download Invoice
                        </button>
                        <Link to={`/hotels/${booking.hotel?._id}`} className="btn btn-primary">
                          Book Again
                        </Link>
                      </>
                    )}
                    {booking.bookingStatus === 'cancelled' && (
                      <Link to={`/hotels/${booking.hotel?._id}`} className="btn btn-primary">
                        Book Again
                        </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
