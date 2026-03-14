const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  guests: {
    adults: { type: Number, required: true },
    children: { type: Number, default: 0 }
  },
  guestDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  orderId: {
    type: String
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  cancellationReason: {
    type: String
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'admin']
  },
  cancelledAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const checkIn = new Date(this.checkInDate);
  const hoursDiff = (checkIn - now) / (1000 * 60 * 60);
  
  // Can cancel if check-in is more than 24 hours away and status is confirmed
  return hoursDiff > 24 && this.bookingStatus === 'confirmed';
};

// Method to check if booking is past
bookingSchema.methods.isPast = function() {
  const now = new Date();
  const checkOut = new Date(this.checkOutDate);
  return checkOut < now;
};

module.exports = mongoose.model('Booking', bookingSchema);
