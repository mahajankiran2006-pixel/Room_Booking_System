import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { FaStar, FaHotel, FaHeadset, FaShieldAlt, FaMapMarkerAlt, FaDollarSign, FaAward, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaHotel />,
      title: 'Luxury Rooms',
      description: 'Premium accommodations with world-class amenities and stunning views',
      delay: 0.1
    },
    {
      icon: <FaHeadset />,
      title: '24/7 Support',
      description: 'Round-the-clock customer service to assist you anytime, anywhere',
      delay: 0.2
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure Booking',
      description: '100% secure payment gateway with instant confirmation',
      delay: 0.3
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Prime Locations',
      description: 'Hotels in the most sought-after destinations worldwide',
      delay: 0.4
    },
    {
      icon: <FaDollarSign />,
      title: 'Best Prices',
      description: 'Competitive rates with exclusive deals and discounts',
      delay: 0.5
    },
    {
      icon: <FaAward />,
      title: 'Award Winning',
      description: 'Recognized for excellence in hospitality and service',
      delay: 0.6
    }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      image: 'https://i.pravatar.cc/300?img=12',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      image: 'https://i.pravatar.cc/300?img=5',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    {
      name: 'Amit Patel',
      role: 'Customer Relations',
      image: 'https://i.pravatar.cc/300?img=13',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    {
      name: 'Sneha Reddy',
      role: 'Marketing Director',
      image: 'https://i.pravatar.cc/300?img=9',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    }
  ];

  const stats = [
    { number: 10000, suffix: '+', label: 'Happy Customers', duration: 2 },
    { number: 500, suffix: '+', label: 'Luxury Rooms', duration: 2.5 },
    { number: 50, suffix: '+', label: 'Locations', duration: 2 },
    { number: 4.8, suffix: '', label: 'Average Rating', duration: 2, decimals: 1 }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | Hotel Room Booking</title>
        <meta name="description" content="Learn about LuxuryStay Hotels - your trusted partner for luxury hotel bookings. Discover our story, mission, and commitment to excellence." />
      </Helmet>
      
      <div className="about-us-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <motion.div 
          className="about-hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Experience Comfort & Luxury</h1>
          <p>Creating unforgettable stays since 2010</p>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="our-story">
        <div className="container">
          <div className="story-grid">
            <motion.div 
              className="story-image"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800" alt="Our Story" />
            </motion.div>
            <motion.div 
              className="story-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Our Story</h2>
              <p className="story-intro">
                Founded in 2010, LuxuryStay has been at the forefront of redefining hospitality excellence.
              </p>
              <p>
                What started as a single boutique hotel has grown into a network of premium properties across major cities. Our journey has been driven by a simple yet powerful vision: to create extraordinary experiences that turn moments into memories.
              </p>
              <p>
                We believe that every guest deserves personalized attention, luxurious comfort, and impeccable service. Our commitment to excellence has earned us the trust of thousands of travelers worldwide.
              </p>
              <div className="story-mission">
                <h3>Our Mission</h3>
                <p>
                  To provide world-class hospitality that exceeds expectations, combining luxury, comfort, and authentic local experiences in every stay.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
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

          <div className="features-grid-about">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card-about card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="feature-icon-about">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatCounter key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="our-team">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">Dedicated professionals committed to your comfort</p>
          </motion.div>

          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="team-image-wrapper">
                  <img src={member.image} alt={member.name} />
                  <div className="team-social">
                    <a href={member.social.linkedin}><FaLinkedin /></a>
                    <a href={member.social.twitter}><FaTwitter /></a>
                    <a href={member.social.instagram}><FaInstagram /></a>
                  </div>
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <motion.div
            className="cta-content-about"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Experience Luxury?</h2>
            <p>Book your dream stay today and create unforgettable memories</p>
            <motion.button 
              className="btn btn-primary btn-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/hotels')}
            >
              Book Your Stay Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};

// Animated Counter Component
const StatCounter = ({ number, suffix, label, duration, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = number;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [inView, number, duration]);

  return (
    <motion.div
      ref={ref}
      className="stat-item"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="stat-number">
        {count.toFixed(decimals)}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
};

export default AboutUs;
