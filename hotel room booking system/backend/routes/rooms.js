const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

// Get rooms by hotel with availability check
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const { checkIn, checkOut, category, minPrice, maxPrice, sortBy } = req.query;
    let query = { hotel: req.params.hotelId };

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let rooms = await Room.find(query).populate('hotel');

    // Check availability if dates provided
    if (checkIn && checkOut) {
      const bookedRooms = await Booking.find({
        checkInDate: { $lt: new Date(checkOut) },
        checkOutDate: { $gt: new Date(checkIn) },
        bookingStatus: { $ne: 'cancelled' }
      }).select('room');

      const bookedRoomIds = bookedRooms.map(b => b.room.toString());
      rooms = rooms.filter(room => !bookedRoomIds.includes(room._id.toString()));
    }

    // Sorting
    if (sortBy === 'price-asc') {
      rooms.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      rooms.sort((a, b) => b.price - a.price);
    }

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create room (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update room (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete room (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
