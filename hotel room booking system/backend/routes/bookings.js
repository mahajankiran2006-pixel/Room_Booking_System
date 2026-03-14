const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create booking
router.post('/', protect, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      user: req.user._id
    };

    const booking = await Booking.create(bookingData);
    const populatedBooking = await Booking.findById(booking._id)
      .populate('hotel')
      .populate('room')
      .populate('user');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel')
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('room')
      .populate('user');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking (User)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({ 
        message: 'Booking cannot be cancelled. Check-in is less than 24 hours away or booking is not confirmed.' 
      });
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.cancelledBy = 'user';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    
    // Update payment status for refund
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }
    
    await booking.save();

    // Restore room availability
    if (booking.room) {
      await Room.findByIdAndUpdate(booking.room, {
        isAvailable: true
      });
    }

    res.json({ 
      success: true,
      message: 'Booking cancelled successfully. Refund will be processed within 5-7 business days.', 
      booking 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings (Admin only)
router.get('/admin/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, startDate, endDate, search } = req.query;
    let query = {};

    // Filter by booking status
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.checkInDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Search by guest name or email
    if (search) {
      query.$or = [
        { 'guestDetails.name': { $regex: search, $options: 'i' } },
        { 'guestDetails.email': { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('hotel')
      .populate('room')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status (Admin only)
router.put('/admin/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { bookingStatus, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(bookingStatus)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    // Update booking status
    const oldStatus = booking.bookingStatus;
    booking.bookingStatus = bookingStatus;

    // Handle cancellation
    if (bookingStatus === 'cancelled') {
      booking.cancelledBy = 'admin';
      booking.cancelledAt = new Date();
      booking.cancellationReason = cancellationReason || 'Cancelled by admin';
      
      // Update payment status for refund
      if (booking.paymentStatus === 'paid') {
        booking.paymentStatus = 'refunded';
      }

      // Restore room availability
      if (booking.room) {
        await Room.findByIdAndUpdate(booking.room, {
          isAvailable: true
        });
      }
    }

    // Handle confirmation
    if (bookingStatus === 'confirmed' && oldStatus === 'pending') {
      // Mark room as unavailable when confirming
      if (booking.room) {
        await Room.findByIdAndUpdate(booking.room, {
          isAvailable: false
        });
      }
    }

    // Handle completion
    if (bookingStatus === 'completed') {
      booking.completedAt = new Date();
    }

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('hotel')
      .populate('room')
      .populate('user', 'name email');

    res.json({
      success: true,
      message: `Booking status updated from ${oldStatus} to ${bookingStatus}`,
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking statistics (Admin only)
router.get('/admin/stats/summary', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$bookingStatus',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      stats,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send confirmation email
router.post('/:id/send-confirmation', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('room');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.guestDetails.email,
      subject: 'Booking Confirmation',
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Dear ${booking.guestDetails.name},</p>
        <p>Your booking has been confirmed.</p>
        <h3>Booking Details:</h3>
        <p>Hotel: ${booking.hotel.name}</p>
        <p>Room: ${booking.room.category}</p>
        <p>Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}</p>
        <p>Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
        <p>Total Amount: ₹${booking.totalAmount}</p>
        <p>Booking ID: ${booking._id}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Confirmation email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
