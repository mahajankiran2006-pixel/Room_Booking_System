const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// Validate amount
const validateAmount = (amount) => {
  if (!amount || amount <= 0) {
    throw new Error('Invalid amount');
  }
  if (amount > 1000000) { // Max 10 lakh
    throw new Error('Amount exceeds maximum limit');
  }
  return true;
};

// Check for duplicate payment
const checkDuplicatePayment = async (bookingId) => {
  const existingPayment = await Payment.findOne({
    booking: bookingId,
    status: { $in: ['pending', 'success'] }
  });
  
  if (existingPayment) {
    throw new Error('Payment already exists for this booking');
  }
};

// Create Razorpay Order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, bookingId, paymentMethod } = req.body;

    // Validate inputs
    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    validateAmount(amount);

    // Check for duplicate payment
    await checkDuplicatePayment(bookingId);

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to booking' });
    }

    // Verify amount matches booking amount
    if (Math.abs(booking.totalAmount - amount) > 1) {
      return res.status(400).json({ message: 'Amount mismatch' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${bookingId}_${Date.now()}`,
      notes: {
        bookingId: bookingId,
        userId: req.user._id.toString(),
        paymentMethod: paymentMethod || 'Card'
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      user: req.user._id,
      amount: amount,
      currency: 'INR',
      paymentMethod: paymentMethod || 'Card',
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        paymentSource: 'web'
      }
    });

    payment.generateTransactionId();
    await payment.save();

    // Update booking with order ID and set status to pending
    booking.orderId = razorpayOrder.id;
    booking.paymentStatus = 'pending';
    booking.bookingStatus = 'pending';
    await booking.save();

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      transactionId: payment.transactionId,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
});

// Verify Payment
router.post('/verify', protect, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      bookingId 
    } = req.body;

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Find payment record
    const payment = await Payment.findOne({ 
      razorpayOrderId: razorpay_order_id,
      user: req.user._id 
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Check if already verified
    if (payment.status === 'success') {
      // Get the booking details
      const booking = await Booking.findById(payment.booking)
        .populate('hotel')
        .populate('room');
      
      return res.json({ 
        success: true,
        message: 'Payment already verified',
        transactionId: payment.transactionId,
        paymentId: payment.razorpayPaymentId,
        booking: booking
      });
    }

    // Verify signature using HMAC SHA256
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(sign.toString())
      .digest('hex');

    const isSignatureValid = razorpay_signature === expectedSign;

    if (!isSignatureValid) {
      // Mark payment as failed
      payment.status = 'failed';
      payment.failureReason = 'Invalid signature - Payment verification failed';
      await payment.save();

      // Update booking status to failed
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: 'failed',
        bookingStatus: 'cancelled'
      });

      return res.status(400).json({ 
        success: false,
        message: 'Payment verification failed - Invalid signature' 
      });
    }

    // Signature is valid - Update payment record
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'success';
    await payment.save();

    // Update booking - Mark as confirmed and payment as paid
    const booking = await Booking.findByIdAndUpdate(
      payment.booking,
      {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        bookingStatus: 'confirmed'  // Auto-confirm on successful payment
      },
      { new: true }
    )
    .populate('hotel')
    .populate('room');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ 
      success: true,
      message: 'Payment verified successfully. Booking confirmed!',
      transactionId: payment.transactionId,
      paymentId: razorpay_payment_id,
      booking: booking
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Payment verification failed' 
    });
  }
});

// Get payment details
router.get('/:transactionId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      transactionId: req.params.transactionId,
      user: req.user._id 
    })
    .populate('booking')
    .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initiate refund (Admin only)
router.post('/refund', protect, async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status !== 'success') {
      return res.status(400).json({ message: 'Invalid payment for refund' });
    }

    // Create refund with Razorpay
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: amount * 100,
      notes: { reason }
    });

    // Update payment record
    payment.status = 'refunded';
    payment.refundId = refund.id;
    payment.refundAmount = amount;
    await payment.save();

    // Update booking
    await Booking.findByIdAndUpdate(payment.booking, {
      paymentStatus: 'refunded',
      bookingStatus: 'cancelled'
    });

    res.json({ 
      success: true,
      message: 'Refund initiated successfully',
      refundId: refund.id 
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get payment statistics (Admin only)
router.get('/stats/summary', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const stats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
