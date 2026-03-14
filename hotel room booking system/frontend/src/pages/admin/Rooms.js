import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Admin.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({
    hotel: '', roomNumber: '', category: 'Standard', price: 0, capacity: 1, isAvailable: true
  });

  useEffect(() => {
    fetchHotels();
    fetchRooms();
  }, []);

  const fetchHotels = async () => {
    const { data } = await axios.get('/api/hotels');
    setHotels(data);
  };

  const fetchRooms = async () => {
    try {
      const allRooms = [];
      for (const hotel of hotels) {
        const { data } = await axios.get(`/api/rooms/hotel/${hotel._id}`);
        allRooms.push(...data);
      }
      setRooms(allRooms);
    } catch (error) {
      console.error('Failed to load rooms');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRoom) {
        await axios.put(`/api/rooms/${currentRoom._id}`, formData);
        toast.success('Room updated');
      } else {
        await axios.post('/api/rooms', formData);
        toast.success('Room created');
      }
      setShowModal(false);
      fetchRooms();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await axios.delete(`/api/rooms/${id}`);
      toast.success('Room deleted');
      fetchRooms();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({ hotel: '', roomNumber: '', category: 'Standard', price: 0, capacity: 1, isAvailable: true });
    setCurrentRoom(null);
  };

  const openEditModal = (room) => {
    setCurrentRoom(room);
    setFormData({ ...room, hotel: room.hotel._id });
    setShowModal(true);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Manage Rooms</h1>
        <div className="admin-actions">
          <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Room</button>
        </div>

        <div className="items-grid">
          {rooms.map(room => (
            <div key={room._id} className="item-card card">
              <div className="item-info">
                <h3>{room.category} - Room #{room.roomNumber}</h3>
                <p>Hotel: {room.hotel?.name}</p>
                <p>Price: ₹{room.price}/night</p>
                <p>Status: {room.isAvailable ? 'Available' : 'Unavailable'}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => openEditModal(room)} className="btn btn-primary">Edit</button>
                <button onClick={() => handleDelete(room._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{currentRoom ? 'Edit Room' : 'Add Room'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Hotel</label>
                  <select value={formData.hotel} onChange={(e) => setFormData({...formData, hotel: e.target.value})} required>
                    <option value="">Select Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Room Number</label>
                  <input type="text" value={formData.roomNumber} onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price per Night</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" min="1" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
