import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Admin.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, searchTerm]);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await axios.get(`/api/bookings/admin/all?${params}`);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.bookingStatus);
    setCancellationReason('');
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedBooking || !newStatus) return;

    if (newStatus === 'cancelled' && !cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/bookings/admin/${selectedBooking._id}/status`,
        {
          bookingStatus: newStatus,
          cancellationReason: cancellationReason
        }
      );

      toast.success(data.message);
      setShowStatusModal(false);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Quick action: Confirm booking
  const handleQuickConfirm = async (booking) => {
    if (!window.confirm(`Confirm booking for ${booking.guestDetails.name}?`)) return;

    try {
      await axios.put(
        `/api/bookings/admin/${booking._id}/status`,
        {
          bookingStatus: 'confirmed',
          cancellationReason: ''
        }
      );

      toast.success('Booking confirmed successfully!');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm booking');
    }
  };

  // Quick action: Cancel booking
  const handleQuickCancel = async (booking) => {
    const reason = window.prompt(`Cancel booking for ${booking.guestDetails.name}?\n\nPlease enter cancellation reason:`);
    
    if (!reason) {
      toast.error('Cancellation reason is required');
      return;
    }

    try {
      await axios.put(
        `/api/bookings/admin/${booking._id}/status`,
        {
          bookingStatus: 'cancelled',
          cancellationReason: reason
        }
      );

      toast.success('Booking cancelled successfully!');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: '#FF9800', bg: '#FFF4E6', label: '🟡 Pending' },
      confirmed: { color: '#1BA345', bg: '#E8F5E9', label: '🟢 Confirmed' },
      cancelled: { color: '#F44336', bg: '#FFEBEE', label: '🔴 Cancelled' },
      completed: { color: '#2196F3', bg: '#E3F2FD', label: '🔵 Completed' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span style={{ 
        background: badge.bg, 
        color: badge.color, 
        padding: '6px 12px', 
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600'
      }}>
        {badge.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const badges = {
      pending: { color: '#FF9800', bg: '#FFF4E6', label: 'Pending' },
      paid: { color: '#1BA345', bg: '#E8F5E9', label: 'Paid' },
      failed: { color: '#F44336', bg: '#FFEBEE', label: 'Failed' },
      refunded: { color: '#9C27B0', bg: '#F3E5F5', label: 'Refunded' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span style={{ 
        background: badge.bg, 
        color: badge.color, 
        padding: '4px 10px', 
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {badge.label}
      </span>
    );
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Booking Management</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-label">Total Bookings</span>
            <span className="stat-value">{bookings.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Confirmed</span>
            <span className="stat-value">{bookings.filter(b => b.bookingStatus === 'confirmed').length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{bookings.filter(b => b.bookingStatus === 'pending').length}</span>
          </div>
        </div>
      </div>

      <div className="admin-filters">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by guest name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>View:</label>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📋 Table
            </button>
            <button 
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              🎴 Cards
            </button>
          </div>
        </div>
      </div>

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="bookings-cards-grid">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card-admin">
              <div className="booking-card-header">
                <div>
                  <h3>{booking.hotel?.name}</h3>
                  <p className="booking-id-small">Booking ID: {booking._id.substring(0, 12).toUpperCase()}</p>
                </div>
                {getStatusBadge(booking.bookingStatus)}
              </div>

              <div className="booking-card-image">
                <img 
                  src={booking.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} 
                  alt={booking.hotel?.name}
                />
              </div>

              <div className="booking-card-details">
                <div className="detail-row">
                  <span className="detail-label">ROOM TYPE</span>
                  <span className="detail-value">{booking.room?.category} - #{booking.room?.roomNumber}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">CHECK-IN</span>
                  <span className="detail-value">{new Date(booking.checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">CHECK-OUT</span>
                  <span className="detail-value">{new Date(booking.checkOutDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">GUESTS</span>
                  <span className="detail-value">{booking.guests.adults} Adults, {booking.guests.children} Children</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">TOTAL AMOUNT</span>
                  <span className="detail-value amount">₹{booking.totalAmount}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">PAYMENT STATUS</span>
                  <span className="detail-value">{getPaymentBadge(booking.paymentStatus)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {booking.bookingStatus === 'pending' && (
                <div className="booking-card-actions">
                  <button 
                    className="btn-card btn-confirm"
                    onClick={() => handleQuickConfirm(booking)}
                  >
                    ✓ Confirm
                  </button>
                  <button 
                    className="btn-card btn-cancel"
                    onClick={() => handleQuickCancel(booking)}
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}

              {booking.bookingStatus !== 'pending' && (
                <div className="booking-card-actions">
                  <button 
                    className="btn-card btn-update"
                    onClick={() => handleStatusChange(booking)}
                  >
                    Update Status
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest Details</th>
              <th>Hotel & Room</th>
              <th>Check-in / Check-out</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Booking Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>
                  <div className="booking-id-cell">
                    <strong>{booking._id.substring(0, 8).toUpperCase()}</strong>
                    <small>{new Date(booking.createdAt).toLocaleDateString()}</small>
                  </div>
                </td>
                <td>
                  <div className="guest-cell">
                    <strong>{booking.guestDetails.name}</strong>
                    <small>{booking.guestDetails.email}</small>
                    <small>{booking.guestDetails.phone}</small>
                  </div>
                </td>
                <td>
                  <div className="hotel-cell">
                    <strong>{booking.hotel?.name}</strong>
                    <small>{booking.room?.category} - #{booking.room?.roomNumber}</small>
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    <div>📅 {new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                    <div>📅 {new Date(booking.checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  </div>
                </td>
                <td>
                  <strong style={{color: 'var(--primary-gold)'}}>₹{booking.totalAmount}</strong>
                </td>
                <td>
                  {getPaymentBadge(booking.paymentStatus)}
                </td>
                <td>
                  {getStatusBadge(booking.bookingStatus)}
                </td>
                <td>
                  <div className="action-buttons">
                    {booking.bookingStatus === 'pending' ? (
                      <>
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleQuickConfirm(booking)}
                          title="Confirm Booking"
                        >
                          ✓ Confirm
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleQuickCancel(booking)}
                          title="Cancel Booking"
                        >
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStatusChange(booking)}
                      >
                        Update Status
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="no-data">
            <p>No bookings found</p>
          </div>
        )}
        </div>
      )}

      {/* No bookings message for card view */}
      {viewMode === 'cards' && bookings.length === 0 && (
        <div className="no-data">
          <p>No bookings found</p>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Booking Status</h3>
              <button className="modal-close" onClick={() => setShowStatusModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="booking-info">
                <p><strong>Booking ID:</strong> {selectedBooking?._id.substring(0, 12).toUpperCase()}</p>
                <p><strong>Guest:</strong> {selectedBooking?.guestDetails.name}</p>
                <p><strong>Current Status:</strong> {getStatusBadge(selectedBooking?.bookingStatus)}</p>
              </div>

              <div className="form-group">
                <label>New Status:</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {newStatus === 'cancelled' && (
                <div className="form-group">
                  <label>Cancellation Reason: *</label>
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Enter reason for cancellation..."
                    rows="3"
                    required
                  />
                </div>
              )}

              <div className="status-info">
                {newStatus === 'confirmed' && (
                  <p className="info-message">✅ Booking will be marked as confirmed</p>
                )}
                {newStatus === 'cancelled' && (
                  <p className="warning-message">⚠️ Booking will be cancelled and refund will be initiated</p>
                )}
                {newStatus === 'completed' && (
                  <p className="info-message">✅ Booking will be marked as completed</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowStatusModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmStatusChange}>
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
