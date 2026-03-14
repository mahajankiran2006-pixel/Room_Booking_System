import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaUsers, FaStar, FaCheckCircle, FaShieldAlt, FaClock } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData).toString();
    navigate(`/hotels?${params}`);
  };

  const features = [
    {
      icon: <FaStar />,
      title: 'Luxury Rooms',
      description: 'Premium accommodations with world-class amenities',
      delay: 0.1
    },
    {
      icon: <FaCheckCircle />,
      title: 'Best Price Guarantee',
      description: 'Lowest prices guaranteed or we refund the difference',
      delay: 0.2
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure Booking',
      description: '100% secure payment with instant confirmation',
      delay: 0.3
    },
    {
      icon: <FaClock />,
      title: '24/7 Support',
      description: 'Round-the-clock customer service for your convenience',
      delay: 0.4
    }
  ];

  const destinations = [
    { name: 'Mumbai', hotels: '150+ Hotels', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600', delay: 0.1 },
    { name: 'Goa', hotels: '200+ Hotels', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', delay: 0.2 },
    { name: 'Jaipur', hotels: '120+ Hotels', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', delay: 0.3 },
    { name: 'Delhi', hotels: '300+ Hotels', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', delay: 0.4 },
    { name: 'Bangalore', hotels: '250+ Hotels', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600', delay: 0.5 },
    { name: 'Kerala', hotels: '180+ Hotels', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', delay: 0.6 }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      rating: 5,
      text: 'Absolutely wonderful experience! The booking process was seamless and the hotel exceeded all expectations.',
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'Rahul Verma',
      rating: 5,
      text: 'Best hotel booking platform I have used. Great prices and excellent customer service.',
      image: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'Anita Desai',
      rating: 5,
      text: 'Highly recommend! Found the perfect hotel for our family vacation at an amazing price.',
      image: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Hotel Room Booking – Book Your Stay Online | LuxuryStay</title>
        <meta name="description" content="Book luxury hotel rooms online with LuxuryStay. Find the best hotels, compare prices, and enjoy secure booking with instant confirmation." />
      </Helmet>
      
      <div className="home-premium">
      {/* Hero Section with Parallax */}
      <section className="hero-premium" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-overlay"></div>
        <div className="hero-video-container">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920" 
            alt="Luxury Hotel"
            className="hero-background"
          />
        </div>
        
        <div className="hero-content-premium">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title-premium">
              Discover Your Perfect
              <span className="gradient-text"> Luxury Stay</span>
            </h1>
            <p className="hero-subtitle-premium">
              Experience world-class hospitality at the finest hotels
            </p>
          </motion.div>

          <motion.form 
            className="search-form-premium glass-card"
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="search-input-group">
              <FaSearch className="input-icon" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={searchData.location}
                onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                required
              />
            </div>

            <div className="search-input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                required
              />
            </div>

            <div className="search-input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                value={searchData.checkOut}
                onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                required
              />
            </div>

            <div className="search-input-group">
              <FaUsers className="input-icon" />
              <select 
                value={searchData.guests}
                onChange={(e) => setSearchData({...searchData, guests: e.target.value})}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            <motion.button 
              type="submit" 
              className="btn btn-primary search-btn-premium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSearch /> Search Hotels
            </motion.button>
          </motion.form>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-premium">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">Experience the difference with our premium services</p>
          </motion.div>

          <div className="features-grid-premium">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card-premium card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon-premium">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-premium">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Explore the most sought-after locations</p>
          </motion.div>

          <div className="destinations-grid-premium">
            {destinations.map((dest, index) => (
              <motion.div
                key={index}
                className="destination-card-premium"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: dest.delay }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSearchData({...searchData, location: dest.name});
                  navigate(`/hotels?location=${dest.name}`);
                }}
              >
                <div className="destination-image-premium">
                  <img src={dest.image} alt={dest.name} />
                  <div className="destination-overlay-premium">
                    <h3>{dest.name}</h3>
                    <p>{dest.hotels}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-premium">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">What Our Guests Say</h2>
            <p className="section-subtitle">Real experiences from real travelers</p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <span>{testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-premium">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Start Your Journey?</h2>
            <p>Book your dream hotel today and create unforgettable memories</p>
            <motion.button 
              className="btn btn-primary btn-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/hotels')}
            >
              Explore Hotels
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
