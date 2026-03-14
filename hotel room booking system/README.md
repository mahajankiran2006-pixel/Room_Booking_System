# Hotel Room Booking System 🏨

A modern, full-stack hotel room booking website built with React JS, Node.js, Express, and MongoDB. Features include user authentication, hotel management, room booking, secure payment integration with Razorpay, and an admin dashboard.

## 🌟 Features

### User Features
- 🔐 User registration and login with JWT authentication
- 🏨 Browse hotels by location with advanced filters
- 🛏️ View detailed hotel and room information
- 📅 Real-time room availability checking
- 💳 Secure payment integration with Razorpay
- 🎫 Booking confirmation with transaction details
- 📋 View and manage booking history
- ⭐ Customer reviews and ratings
- 📱 Fully responsive design

### Admin Features
- 📊 Comprehensive dashboard with statistics
- 🏨 Hotel management (add, edit, delete)
- 🛏️ Room management with availability tracking
- 📋 Booking management and monitoring
- 👥 User management
- 💰 Payment tracking and refunds
- 📈 Revenue and booking analytics

### Payment System
- ✅ Razorpay payment gateway integration
- 💳 Multiple payment methods (UPI, Card, NetBanking, Wallet)
- 🔒 Secure HMAC SHA256 signature verification
- 🎟️ Promo code support
- 📄 Transaction tracking with unique IDs
- 💸 Refund processing (admin)
- 🎉 Beautiful payment success animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud)
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hotel-room-booking-system
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

4. **Configure Environment Variables**

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:3000
```

Create `frontend/.env`:
```env
# Demo Mode - Set to true to test without Razorpay
REACT_APP_DEMO_MODE=true
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

5. **Seed Database (Optional)**
```bash
cd backend
node seedData.js
```

This creates:
- 5 sample hotels
- 60 rooms across hotels
- 2 test users (user@example.com / admin@example.com)

6. **Start Backend Server**
```bash
cd backend
npm start
```
Backend runs on: http://localhost:5000

7. **Start Frontend Server**
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

## 📖 Documentation

### Essential Guides
- **[QUICK_START.md](QUICK_START.md)** - Quick setup and running guide
- **[DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)** - Production deployment guide
- **[RAZORPAY_SETUP_GUIDE.md](RAZORPAY_SETUP_GUIDE.md)** - Razorpay configuration
- **[PAYMENT_IMPLEMENTATION.md](PAYMENT_IMPLEMENTATION.md)** - Payment system details
- **[PAYMENT_TESTING_GUIDE.md](PAYMENT_TESTING_GUIDE.md)** - Payment testing scenarios
- **[PAYMENT_SUCCESS_HANDLING.md](PAYMENT_SUCCESS_HANDLING.md)** - Success message implementation
- **[PAYMENT_SUCCESS_HINDI_GUIDE.md](PAYMENT_SUCCESS_HINDI_GUIDE.md)** - Hindi guide for payment

## 🎨 Tech Stack

### Frontend
- React JS 18
- React Router DOM
- Axios
- React Toastify
- Framer Motion (animations)
- React Icons
- Swiper (sliders)
- React Helmet Async (SEO)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Razorpay SDK
- Bcrypt for password hashing
- CORS

## 🔐 Authentication

### Test Accounts
```
User Account:
Email: user@example.com
Password: password123

Admin Account:
Email: admin@example.com
Password: admin123
```

## 💳 Payment Testing

### Demo Mode (Enabled by Default)
- No Razorpay setup needed
- Shows payment success immediately
- Perfect for testing UI/UX

### Test Cards (When Razorpay is configured)
```
Success Card:
Card: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date

Failure Card:
Card: 4000 0000 0000 0002
CVV: 123
Expiry: Any future date
```

### Promo Codes
- `SAVE10` - 10% discount
- `SAVE20` - 20% discount
- `FIRST50` - ₹50 flat discount

## 📱 Pages

### Public Pages
- **Home** - Hero section with search, features, destinations
- **Hotels** - Browse hotels with filters (price, rating, amenities)
- **Hotel Details** - Detailed hotel and room information
- **About Us** - Company information and team
- **Reviews** - Customer reviews and ratings
- **Login/Register** - User authentication

### User Pages (Protected)
- **Booking** - Complete booking with payment
- **Booking Success** - Payment confirmation details
- **My Bookings** - View and manage bookings

### Admin Pages (Admin Only)
- **Dashboard** - Statistics and overview
- **Hotels** - Manage hotels
- **Rooms** - Manage rooms
- **Bookings** - View all bookings
- **Users** - Manage users

## 🎯 Key Features Implemented

### Payment Success Flow
1. User clicks "Pay Now"
2. Processing animation shows
3. Payment completes (Demo or Razorpay)
4. **Animated success modal appears** with:
   - Green checkmark animation
   - Transaction ID
   - Amount paid
   - Redirect countdown
5. Toast notification
6. Redirect to success page with full details

### Security Features
- JWT token authentication
- Password hashing with bcrypt
- HMAC SHA256 payment verification
- Amount validation on backend
- Duplicate payment prevention
- Protected routes
- Role-based access control

### UI/UX Features
- Smooth animations with Framer Motion
- Glassmorphism effects
- Responsive design (mobile, tablet, desktop)
- Loading states and skeletons
- Error handling with retry options
- Toast notifications
- Professional footer with links

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/:transactionId` - Get payment details
- `POST /api/payments/refund` - Initiate refund (admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `POST /api/admin/hotels` - Add hotel
- `PUT /api/admin/hotels/:id` - Update hotel
- `DELETE /api/admin/hotels/:id` - Delete hotel

## 🎨 Color Scheme

- **Primary Gold**: #D4AF37
- **Luxury Brown**: #8B7355
- **Deep Brown**: #5C4A3A
- **Success Green**: #1BA345
- **Cream**: #FAF8F3
- **Text Dark**: #2C2416

## 🐛 Troubleshooting

### Payment Not Working?
- Check Razorpay keys in `.env`
- Enable Demo Mode for testing: `REACT_APP_DEMO_MODE=true`
- See [RAZORPAY_SETUP_GUIDE.md](RAZORPAY_SETUP_GUIDE.md)

### Database Connection Error?
- Ensure MongoDB is running
- Check `MONGODB_URI` in backend `.env`

### Frontend Not Loading?
- Check if backend is running on port 5000
- Verify API URL configuration

## 📄 License

This project is for educational purposes.

---

**Status**: ✅ Production Ready
**Version**: 1.0
**Last Updated**: March 2, 2026

**Quick Links**:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Documentation: See guides in root folder
