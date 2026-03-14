import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const transactionId = searchParams.get('transactionId');
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!transactionId || !bookingId) {
      navigate('/my-bookings');
      return;
    }
    fetchBookingDetails();
  }, [transactionId, bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data } = await axios.get(`/api/bookings/${bookingId}`);
      setBooking(data);
      
      // Verify booking is confirmed
      if (data.paymentStatus !== 'completed') {
        console.warn('Booking payment not completed');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = () => {
    // Implement invoice download
    alert('Invoice download feature coming soon!');
  };

  if (loading) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (!booking) {
    return (
      <div className="booking-success-page">
        <div className="container">
          <div className="error-message">
            <h2>Booking not found</h2>
            <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful | Hotel Room Booking</title>
        <meta name="description" content="Your payment was successful and booking has been confirmed. View your booking details and transaction information." />
      </Helmet>
      
      <div className="booking-success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">
            <div className="checkmark-circle">
              <div className="checkmark">✓</div>
            </div>
          </div>

          <h1>Booking Confirmed!</h1>
          <p className="success-message">
            Your payment was successful and your booking has been confirmed.
          </p>

          <div className="transaction-info">
            <div className="info-row">
              <span className="label">Transaction ID:</span>
              <span className="value transaction-id">{transactionId}</span>
            </div>
            <div className="info-row">
              <span className="label">Booking ID:</span>
              <span className="value">{bookingId.substring(0, 12).toUpperCase()}</span>
            </div>
            {booking.paymentId && (
              <div className="info-row">
                <span className="label">Payment ID:</span>
                <span className="value payment-id">{booking.paymentId}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Payment Status:</span>
              <span className="value status-success">
                <span className="status-icon">✓</span> 
                {booking.paymentStatus === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Booking Status:</span>
              <span className="value status-confirmed">
                <span className="status-icon">✓</span> 
                {booking.bookingStatus === 'confirmed' ? 'Confirmed' : booking.bookingStatus}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Booking Date:</span>
              <span className="value">
                {new Date(booking.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          <div className="booking-details-card">
            <h3>Booking Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Hotel</span>
                <span className="detail-value">{booking.hotel?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Room Type</span>
                <span className="detail-value">{booking.room?.category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Check-in</span>
                <span className="detail-value">
                  {new Date(booking.checkInDate).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Check-out</span>
                <span className="detail-value">
                  {new Date(booking.checkOutDate).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Guests</span>
                <span className="detail-value">
                  {booking.guests.adults} Adults, {booking.guests.children} Children
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Amount Paid</span>
                <span className="detail-value amount">₹{booking.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="guest-info-card">
            <h3>Guest Information</h3>
            <p><strong>Name:</strong> {booking.guestDetails.name}</p>
            <p><strong>Email:</strong> {booking.guestDetails.email}</p>
            <p><strong>Phone:</strong> {booking.guestDetails.phone}</p>
          </div>

          <div className="confirmation-message">
            <p>📧 A confirmation email has been sent to <strong>{booking.guestDetails.email}</strong></p>
            <p>📱 You will receive booking details on <strong>{booking.guestDetails.phone}</strong></p>
          </div>

          <div className="action-buttons">
            <button onClick={downloadInvoice} className="btn btn-secondary">
              📄 Download Invoice
            </button>
            <Link to="/my-bookings" className="btn btn-primary">
              View My Bookings
            </Link>
          </div>

          <div className="next-steps">
            <h4>What's Next?</h4>
            <ul>
              <li>✓ Check your email for booking confirmation</li>
              <li>✓ Save your booking ID for future reference</li>
              <li>✓ Arrive at the hotel on your check-in date</li>
              <li>✓ Show your booking ID at the reception</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BookingSuccess;
