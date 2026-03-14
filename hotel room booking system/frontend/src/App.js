import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import AboutUs from './pages/AboutUs';
import Reviews from './pages/Reviews';
import AdminDashboard from './pages/admin/Dashboard';
import AdminHotels from './pages/admin/Hotels';
import AdminRooms from './pages/admin/Rooms';
import AdminBookings from './pages/admin/Bookings';
import AdminUsers from './pages/admin/Users';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/booking/:roomId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
              <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/hotels" element={<AdminRoute><AdminHotels /></AdminRoute>} />
              <Route path="/admin/rooms" element={<AdminRoute><AdminRooms /></AdminRoute>} />
              <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            </Routes>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
