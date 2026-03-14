import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaStar, FaRegStar, FaUser, FaCheckCircle } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: '',
    hotel: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Simulate loading reviews
    setTimeout(() => {
      setReviews(sampleReviews);
      setLoading(false);
    }, 1000);
  }, []);

  const sampleReviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Absolutely wonderful experience! The hotel exceeded all my expectations. The staff was incredibly friendly and the rooms were spotless. Will definitely book again!',
      date: '2024-02-15',
      hotel: 'Grand Plaza Hotel, Mumbai',
      image: 'https://i.pravatar.cc/150?img=1',
      verified: true
    },
    {
      id: 2,
      name: 'Rahul Verma',
      rating: 5,
      comment: 'Best hotel booking platform I have used. The process was seamless and the customer service was top-notch. Highly recommend to everyone!',
      date: '2024-02-10',
      hotel: 'Royal Heritage Resort, Jaipur',
      image: 'https://i.pravatar.cc/150?img=2',
      verified: true
    },
    {
      id: 3,
      name: 'Anita Desai',
      rating: 4,
      comment: 'Great experience overall. The hotel was beautiful and well-maintained. Only minor issue was the check-in time, but everything else was perfect.',
      date: '2024-02-08',
      hotel: 'Beach Paradise Resort, Goa',
      image: 'https://i.pravatar.cc/150?img=3',
      verified: true
    },
    {
      id: 4,
      name: 'Vikram Singh',
      rating: 5,
      comment: 'Luxury at its finest! The amenities were world-class and the location was perfect. The booking process was smooth and hassle-free.',
      date: '2024-02-05',
      hotel: 'Tech City Inn, Bangalore',
      image: 'https://i.pravatar.cc/150?img=4',
      verified: true
    },
    {
      id: 5,
      name: 'Meera Kapoor',
      rating: 5,
      comment: 'Exceptional service and beautiful rooms. The staff went above and beyond to make our stay memorable. Thank you for the wonderful experience!',
      date: '2024-02-01',
      hotel: 'Capital Business Hotel, Delhi',
      image: 'https://i.pravatar.cc/150?img=5',
      verified: true
    },
    {
      id: 6,
      name: 'Arjun Reddy',
      rating: 4,
      comment: 'Very good hotel with excellent facilities. The breakfast was amazing and the room service was prompt. Would recommend to friends and family.',
      date: '2024-01-28',
      hotel: 'Grand Plaza Hotel, Mumbai',
      image: 'https://i.pravatar.cc/150?img=6',
      verified: true
    }
  ];

  const featuredReviews = sampleReviews.filter(r => r.rating === 5).slice(0, 3);

  const calculateRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      breakdown[review.rating]++;
    });
    return breakdown;
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const ratingBreakdown = calculateRatingBreakdown();
  const averageRating = calculateAverageRating();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setFormData({ name: '', rating: 0, comment: '', hotel: '' });
    }, 3000);
  };

  const StarRating = ({ rating, interactive = false, size = 20, onRate }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          >
            {star <= (interactive ? (hoverRating || rating) : rating) ? (
              <FaStar style={{ fontSize: size, color: 'var(--primary-gold)' }} />
            ) : (
              <FaRegStar style={{ fontSize: size, color: 'var(--text-light)' }} />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Customer Reviews | Hotel Room Booking</title>
        <meta name="description" content="Read authentic customer reviews and ratings for our hotels. See what our guests are saying about their experiences." />
      </Helmet>
      
      <div className="reviews-page">
      {/* Hero Section */}
      <section className="reviews-hero">
        <div className="reviews-hero-overlay"></div>
        <motion.div 
          className="reviews-hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Customer Reviews</h1>
          <p>See what our guests are saying about their experiences</p>
        </motion.div>
      </section>

      {/* Overall Rating Summary */}
      <section className="rating-summary">
        <div className="container">
          <motion.div 
            className="summary-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="summary-left">
              <div className="average-rating">
                <span className="rating-number">{averageRating}</span>
                <StarRating rating={Math.round(parseFloat(averageRating))} size={24} />
                <p className="total-reviews">Based on {reviews.length} reviews</p>
              </div>
            </div>
            <div className="summary-right">
              <h3>Rating Breakdown</h3>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="rating-bar-row">
                  <span className="star-label">{star} <FaStar /></span>
                  <div className="rating-bar">
                    <motion.div 
                      className="rating-bar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(ratingBreakdown[star] / reviews.length) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: star * 0.1 }}
                    />
                  </div>
                  <span className="rating-count">{ratingBreakdown[star]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Testimonials Slider */}
      <section className="featured-testimonials">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Featured Testimonials</h2>
            <p className="section-subtitle">Top-rated experiences from our guests</p>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="testimonials-slider"
          >
            {featuredReviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="testimonial-slide card">
                  <StarRating rating={review.rating} size={20} />
                  <p className="testimonial-text">"{review.comment}"</p>
                  <div className="testimonial-author">
                    <img src={review.image} alt={review.name} />
                    <div>
                      <h4>{review.name}</h4>
                      <p>{review.hotel}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="reviews-grid-section">
        <div className="container">
          <div className="reviews-header">
            <h2 className="section-title">All Reviews</h2>
            <motion.button 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
            >
              Write a Review
            </motion.button>
          </div>

          {/* Add Review Form */}
          {showForm && (
            <motion.div 
              className="review-form-container card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              {submitted ? (
                <motion.div 
                  className="success-message"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <FaCheckCircle className="success-icon" />
                  <h3>Thank You!</h3>
                  <p>Your review has been submitted successfully</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3>Share Your Experience</h3>
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Hotel Name *</label>
                    <input
                      type="text"
                      value={formData.hotel}
                      onChange={(e) => setFormData({...formData, hotel: e.target.value})}
                      required
                      placeholder="Which hotel did you stay at?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Rating *</label>
                    <StarRating 
                      rating={formData.rating} 
                      interactive={true}
                      size={32}
                      onRate={(rating) => setFormData({...formData, rating})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Review *</label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                      required
                      rows="5"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Submit Review</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* Reviews List */}
          {loading ? (
            <div className="reviews-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="review-card skeleton">
                  <div className="skeleton-header"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  className="review-card card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={review.image} alt={review.name} />
                      <div>
                        <h4>{review.name}</h4>
                        {review.verified && (
                          <span className="verified-badge">
                            <FaCheckCircle /> Verified Guest
                          </span>
                        )}
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={18} />
                  </div>
                  <p className="review-text">{review.comment}</p>
                  <div className="review-footer">
                    <span className="review-hotel">{review.hotel}</span>
                    <span className="review-date">{new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
};

export default Reviews;
