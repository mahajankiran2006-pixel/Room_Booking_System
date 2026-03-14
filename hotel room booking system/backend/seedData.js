const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const User = require('./models/User');
require('dotenv').config();

const sampleHotels = [
  {
    name: 'Grand Plaza Hotel',
    location: 'Mumbai',
    address: '123 Marine Drive, Mumbai, Maharashtra 400001',
    description: 'Luxury hotel with stunning sea views and world-class amenities. Perfect for business and leisure travelers.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Parking'],
    rating: 4.5,
    totalRooms: 50
  },
  {
    name: 'Royal Heritage Resort',
    location: 'Jaipur',
    address: '456 Palace Road, Jaipur, Rajasthan 302001',
    description: 'Experience royal hospitality in the heart of Pink City. Traditional architecture with modern comforts.',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Cultural Shows', 'Parking'],
    rating: 4.7,
    totalRooms: 40
  },
  {
    name: 'Tech City Inn',
    location: 'Bangalore',
    address: '789 MG Road, Bangalore, Karnataka 560001',
    description: 'Modern hotel in the IT hub. Perfect for tech professionals and startups.',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
    ],
    amenities: ['WiFi', 'Gym', 'Co-working Space', 'Restaurant', 'Parking'],
    rating: 4.3,
    totalRooms: 60
  },
  {
    name: 'Beach Paradise Resort',
    location: 'Goa',
    address: '321 Beach Road, Calangute, Goa 403516',
    description: 'Beachfront property with private beach access. Perfect for a relaxing vacation.',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'
    ],
    amenities: ['WiFi', 'Beach Access', 'Pool', 'Water Sports', 'Restaurant', 'Bar'],
    rating: 4.8,
    totalRooms: 35
  },
  {
    name: 'Capital Business Hotel',
    location: 'Delhi',
    address: '555 Connaught Place, New Delhi, Delhi 110001',
    description: 'Prime location in the heart of Delhi. Ideal for business travelers.',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
    ],
    amenities: ['WiFi', 'Conference Rooms', 'Gym', 'Restaurant', 'Airport Shuttle'],
    rating: 4.4,
    totalRooms: 80
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    console.log('Cleared existing data');

    // Create hotels
    const hotels = await Hotel.insertMany(sampleHotels);
    console.log(`Created ${hotels.length} hotels`);

    // Create rooms for each hotel
    const roomCategories = ['Standard', 'Deluxe', 'Suite', 'Premium'];
    const roomAmenities = [
      ['WiFi', 'AC', 'TV', 'Mini Bar'],
      ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],
      ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Living Room'],
      ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Living Room', 'Jacuzzi']
    ];
    const basePrices = [1500, 2500, 4500, 6500];

    for (const hotel of hotels) {
      const rooms = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j <= 3; j++) {
          rooms.push({
            hotel: hotel._id,
            roomNumber: `${i + 1}0${j}`,
            category: roomCategories[i],
            price: basePrices[i] + Math.floor(Math.random() * 500),
            capacity: i + 2,
            amenities: roomAmenities[i],
            images: [
              'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'
            ],
            description: `Comfortable ${roomCategories[i]} room with modern amenities`,
            isAvailable: true
          });
        }
      }
      await Room.insertMany(rooms);
      console.log(`Created ${rooms.length} rooms for ${hotel.name}`);
    }

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@hotel.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@hotel.com',
        password: 'admin123',
        phone: '9876543210',
        role: 'admin'
      });
      console.log('Created admin user (email: admin@hotel.com, password: admin123)');
    }

    // Create sample user
    const userExists = await User.findOne({ email: 'user@hotel.com' });
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@hotel.com',
        password: 'user123',
        phone: '9876543211',
        role: 'user'
      });
      console.log('Created test user (email: user@hotel.com, password: user123)');
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin - Email: admin@hotel.com, Password: admin123');
    console.log('User - Email: user@hotel.com, Password: user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
