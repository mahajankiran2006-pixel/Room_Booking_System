import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaUserShield, FaCalendarCheck } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      className={`navbar-premium ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="navbar-content-premium">
          <Link to="/" className="logo-premium">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="logo-icon"
            >
              ✨
            </motion.span>
            <span className="logo-text">
              Luxury<span className="gradient-text">Stay</span>
            </span>
          </Link>

          <div className="nav-links-premium">
            <Link to="/hotels" className="nav-link">Hotels</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/reviews" className="nav-link">Reviews</Link>
            
            {user ? (
              <>
                <Link to="/my-bookings" className="nav-link">
                  <FaCalendarCheck /> My Bookings
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link">
                    <FaUserShield /> Admin
                  </Link>
                )}
                <div className="user-menu">
                  <span className="user-name-premium">
                    <FaUser /> {user.name}
                  </span>
                  <motion.button 
                    onClick={handleLogout} 
                    className="btn btn-secondary btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSignOutAlt /> Logout
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
