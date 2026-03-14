import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Booking.css';

const Booking = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [formData, setFormData] = useState({
    checkInDate: searchParams.get('checkIn') || '',
    checkOutDate: searchParams.get('checkOut') || '',
    adults: 1,
    children: 0,
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: user?.phone || ''
  });

  useEffect(() => {
    fetchRoom();
    loadRazorpay();
  }, [roomId]);

  const fetchRoom = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/rooms/${roomId}`);
      setRoom(data);
    } catch (error) {
      toast.error('Failed to load room details');
      navigate('/hotels');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const nights = Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateSubtotal = () => {
    if (!room) return 0;
    return calculateNights() * room.price;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount;
  };

  const applyPromoCode = () => {
    const validCodes = {
      'SAVE10': 0.10,
      'SAVE20': 0.20,
      'FIRST50': 50
    };

    if (validCodes[promoCode.toUpperCase()]) {
      const code = promoCode.toUpperCase();
      const discountValue = typeof validCodes[code] === 'number' && validCodes[code] < 1
        ? calculateSubtotal() * validCodes[code]
        : validCodes[code];
      
      setDiscount(discountValue);
      toast.success(`Promo code applied! ₹${discountValue} discount`);
    } else {
      toast.error('Invalid promo code');
    }
  };

  const validateForm = () => {
    if (!formData.guestName || !formData.guestEmail || !formData.guestPhone) {
      toast.error('Please fill all guest details');
      return false;
    }

    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return false;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      toast.error('Check-in date cannot be in the past');
      return false;
    }

    if (checkOut <= checkIn) {
      toast.error('Check-out date must be after check-in date');
      return false;
    }

    if (calculateNights() < 1) {
      toast.error('Minimum 1 night booking required');
      return false;
    }

    return true;
  };

  const createBooking = async () => {
    const bookingData = {
      hotel: room.hotel._id,
      room: room._id,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      guests: { 
        adults: parseInt(formData.adults), 
        children: parseInt(formData.children) 
      },
      guestDetails: {
        name: formData.guestName,
        email: formData.guestEmail,
        phone: formData.guestPhone
      },
      totalAmount: calculateTotal()
    };

    const { data } = await axios.post('/api/bookings', bookingData);
    return data;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (paymentProcessing) {
      toast.info('Payment already in progress');
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      const totalAmount = calculateTotal();

      // Create booking first (only if not already created)
      let booking;
      if (currentBookingId) {
        // Use existing booking for retry
        const { data } = await axios.get(`/api/bookings/${currentBookingId}`);
        booking = data;
      } else {
        booking = await createBooking();
        setCurrentBookingId(booking._id);
      }

      // DEMO MODE: Show success directly for testing
      // Remove this block when Razorpay is configured
      if (process.env.REACT_APP_DEMO_MODE === 'true') {
        // Simulate payment success
        setTimeout(() => {
          const demoTransactionId = `DEMO${Date.now().toString(36).toUpperCase()}`;
          
          // Show success modal
          setSuccessData({
            transactionId: demoTransactionId,
            bookingId: booking._id,
            amount: totalAmount
          });
          setShowSuccessModal(true);
          
          toast.success('🎉 Payment successful! Booking confirmed. (Demo Mode)');
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate(`/booking-success?transactionId=${demoTransactionId}&bookingId=${booking._id}`);
          }, 3000);
        }, 2000);
        return;
      }

      // Create Razorpay order
      const { data: orderData } = await axios.post('/api/payments/create-order', { 
        amount: totalAmount,
        bookingId: booking._id,
        paymentMethod: paymentMethod
      });

      // Razorpay options
      const options = {
        key: orderData.keyId || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LuxuryStay Hotels',
        description: `${room.category} Room at ${room.hotel?.name}`,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            setPaymentProcessing(true);
            
            // Verify payment on backend
            const verifyResponse = await axios.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            });

            if (verifyResponse.data.success) {
              // Show success modal
              setSuccessData({
                transactionId: verifyResponse.data.transactionId,
                bookingId: booking._id,
                amount: calculateTotal()
              });
              setShowSuccessModal(true);
              
              toast.success('🎉 Payment successful! Booking confirmed.');
              
              // Redirect to success page after showing modal
              setTimeout(() => {
                navigate(`/booking-success?transactionId=${verifyResponse.data.transactionId}&bookingId=${booking._id}`);
              }, 3000);
            } else {
              throw new Error('Payment verification failed');
            }

          } catch (error) {
            console.error('Payment verification failed:', error);
            setPaymentError(error.response?.data?.message || 'Payment verification failed');
            toast.error('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: formData.guestName,
          email: formData.guestEmail,
          contact: formData.guestPhone
        },
        notes: {
          bookingId: booking._id,
          roomType: room.category
        },
        theme: {
          color: '#D4AF37'
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false);
            toast.info('Payment cancelled. You can retry payment anytime.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setPaymentError(response.error.description || 'Payment failed');
        toast.error(`Payment failed: ${response.error.description}`);
        setPaymentProcessing(false);
      });

      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.message || 'Payment initialization failed';
      setPaymentError(errorMessage);
      toast.error(errorMessage);
      setPaymentProcessing(false);
    }
  };

  const retryPayment = () => {
    setPaymentError(null);
    handlePayment({ preventDefault: () => {} });
  };

  if (loading) return <div className="loading">Loading booking details</div>;
  if (!room) return <div className="error">Room not found</div>;

  return (
    <div className="booking-page">
      <div className="container">
        <h1>Complete Your Booking</h1>
        
        <div className="booking-container">
          <div className="booking-form">
            <form onSubmit={handlePayment}>
              <h3>Guest Details</h3>
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  value={formData.guestName} 
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})} 
                  placeholder="Enter your full name"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  value={formData.guestEmail} 
                  onChange={(e) => setFormData({...formData, guestEmail: e.target.value})} 
                  placeholder="your.email@example.com"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  value={formData.guestPhone} 
                  onChange={(e) => setFormData({...formData, guestPhone: e.target.value})} 
                  placeholder="+91 9876543210"
                  pattern="[0-9]{10}"
                  required 
                />
              </div>
              
              <h3>Booking Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Check-in Date *</label>
                  <input 
                    type="date" 
                    value={formData.checkInDate} 
                    onChange={(e) => setFormData({...formData, checkInDate: e.target.value})} 
                    min={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date *</label>
                  <input 
                    type="date" 
                    value={formData.checkOutDate} 
                    onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} 
                    min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Adults *</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={room.capacity}
                    value={formData.adults} 
                    onChange={(e) => setFormData({...formData, adults: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Children</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="3"
                    value={formData.children} 
                    onChange={(e) => setFormData({...formData, children: e.target.value})} 
                  />
                </div>
              </div>

              <h3>Apply Promo Code</h3>
              <div className="promo-section">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                />
                <button type="button" onClick={applyPromoCode} className="btn btn-secondary">
                  Apply
                </button>
              </div>
              <p style={{fontSize: '13px', color: '#6B6B6B', marginTop: '8px'}}>
                Try: SAVE10, SAVE20, or FIRST50
              </p>

              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">📱</span>
                  <span>UPI (Google Pay, PhonePe, Paytm)</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">💳</span>
                  <span>Debit/Credit Card</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="NetBanking"
                    checked={paymentMethod === 'NetBanking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">🏦</span>
                  <span>Net Banking</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Wallet"
                    checked={paymentMethod === 'Wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">👛</span>
                  <span>Wallet (Paytm, PhonePe, Amazon Pay)</span>
                </label>
              </div>

              <div className="secure-badge">
                <span>🔒</span>
                <span>100% Secure Payment - Your data is encrypted</span>
              </div>

              {paymentError && (
                <div className="payment-error-box">
                  <div className="error-icon">⚠️</div>
                  <div className="error-content">
                    <h4>Payment Failed</h4>
                    <p>{paymentError}</p>
                    <button 
                      type="button" 
                      onClick={retryPayment} 
                      className="btn btn-secondary"
                      disabled={paymentProcessing}
                    >
                      🔄 Retry Payment
                    </button>
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={paymentProcessing || calculateTotal() <= 0}
              >
                {paymentProcessing ? (
                  <>
                    <span className="spinner"></span>
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${calculateTotal()} Now`
                )}
              </button>

              {paymentProcessing && (
                <div className="processing-message">
                  <div className="processing-animation">
                    <div className="pulse-circle"></div>
                    <div className="pulse-circle delay-1"></div>
                    <div className="pulse-circle delay-2"></div>
                  </div>
                  <p>Please wait while we process your payment...</p>
                  <p className="processing-note">Do not close this window or press back button</p>
                </div>
              )}
            </form>
          </div>
          
          <div className="booking-summary card">
            <h3>Booking Summary</h3>
            <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'} alt={room.category} />
            <div className="summary-details">
              <h4>{room.hotel?.name}</h4>
              <p>{room.category} Room</p>
              <p>Room #{room.roomNumber}</p>
              <p>📍 {room.hotel?.location}</p>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row">
                <span>Check-in:</span>
                <span>{formData.checkInDate ? new Date(formData.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="summary-row">
                <span>Check-out:</span>
                <span>{formData.checkOutDate ? new Date(formData.checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="summary-row">
                <span>Guests:</span>
                <span>{formData.adults} Adults, {formData.children} Children</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row">
                <span>₹{room.price} × {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              
              {discount > 0 && (
                <div className="summary-row discount-applied">
                  <span>Discount:</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      {showSuccessModal && successData && (
        <div className="payment-success-modal-overlay">
          <div className="payment-success-modal">
            <div className="success-animation">
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
            </div>
            
            <h2 className="success-title">Payment Successful!</h2>
            <p className="success-message">
              Your booking has been confirmed successfully
            </p>
            
            <div className="success-details">
              <div className="success-detail-item">
                <span className="detail-label">Transaction ID</span>
                <span className="detail-value">{successData.transactionId}</span>
              </div>
              <div className="success-detail-item">
                <span className="detail-label">Amount Paid</span>
                <span className="detail-value amount-paid">₹{successData.amount}</span>
              </div>
            </div>
            
            <div className="success-redirect-message">
              <div className="redirect-spinner"></div>
              <p>Redirecting to booking details...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
