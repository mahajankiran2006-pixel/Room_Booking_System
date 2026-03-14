import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-icon">✨</span>
              Luxury<span className="gradient-text">Stay</span>
            </h3>
            <p className="footer-description">
              Your trusted partner for luxury hotel bookings. Experience world-class hospitality at the finest hotels.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/hotels">Hotels</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cancellation">Cancellation Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <FaEnvelope />
                <a href="mailto:support@luxurystay.com">support@luxurystay.com</a>
              </li>
              <li>
                <FaPhone />
                <a href="tel:+911234567890">+91 123 456 7890</a>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Hotel Room Booking. All Rights Reserved.</p>
          <p className="footer-tagline">Powered by LuxuryStay Hotels</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
