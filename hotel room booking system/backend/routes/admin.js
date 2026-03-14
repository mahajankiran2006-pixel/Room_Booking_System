const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { protect, adminOnly } = require('../middleware/auth');

// Get dashboard statistics
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalHotels = await Hotel.countDocuments();
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ isAvailable: true });

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('room', 'roomNumber category')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalHotels,
      totalRooms,
      availableRooms,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings
router.get('/bookings', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('hotel', 'name location')
      .populate('room', 'roomNumber category')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
