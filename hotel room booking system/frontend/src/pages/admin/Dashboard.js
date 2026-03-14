import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Hotel Room Booking</title>
        <meta name="description" content="Admin dashboard for managing hotels, rooms, bookings, and users." />
      </Helmet>
      
      <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-nav">
          <Link to="/admin/hotels" className="btn btn-primary">Manage Hotels</Link>
          <Link to="/admin/rooms" className="btn btn-primary">Manage Rooms</Link>
          <Link to="/admin/bookings" className="btn btn-primary">Manage Bookings</Link>
          <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card card">
            <h3>Total Bookings</h3>
            <p className="stat-number">{stats?.totalBookings || 0}</p>
          </div>
          <div className="stat-card card">
            <h3>Total Revenue</h3>
            <p className="stat-number">₹{stats?.totalRevenue || 0}</p>
          </div>
          <div className="stat-card card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats?.totalUsers || 0}</p>
          </div>
          <div className="stat-card card">
            <h3>Total Hotels</h3>
            <p className="stat-number">{stats?.totalHotels || 0}</p>
          </div>
          <div className="stat-card card">
            <h3>Total Rooms</h3>
            <p className="stat-number">{stats?.totalRooms || 0}</p>
          </div>
          <div className="stat-card card">
            <h3>Available Rooms</h3>
            <p className="stat-number">{stats?.availableRooms || 0}</p>
          </div>
        </div>

        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking._id.substring(0, 8)}...</td>
                    <td>{booking.user?.name}</td>
                    <td>{booking.hotel?.name}</td>
                    <td>{booking.room?.category}</td>
                    <td>₹{booking.totalAmount}</td>
                    <td><span className={`status ${booking.bookingStatus}`}>{booking.bookingStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
