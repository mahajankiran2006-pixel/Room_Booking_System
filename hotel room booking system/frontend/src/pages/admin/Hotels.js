import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Admin.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '', location: '', address: '', description: '', rating: 0
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get('/api/hotels');
      setHotels(data);
    } catch (error) {
      toast.error('Failed to load hotels');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentHotel) {
        await axios.put(`/api/hotels/${currentHotel._id}`, formData);
        toast.success('Hotel updated');
      } else {
        await axios.post('/api/hotels', formData);
        toast.success('Hotel created');
      }
      setShowModal(false);
      fetchHotels();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try {
      await axios.delete(`/api/hotels/${id}`);
      toast.success('Hotel deleted');
      fetchHotels();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', address: '', description: '', rating: 0 });
    setCurrentHotel(null);
  };

  const openEditModal = (hotel) => {
    setCurrentHotel(hotel);
    setFormData(hotel);
    setShowModal(true);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Manage Hotels</h1>
        <div className="admin-actions">
          <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Hotel</button>
        </div>

        <div className="items-grid">
          {hotels.map(hotel => (
            <div key={hotel._id} className="item-card card">
              <div className="item-info">
                <h3>{hotel.name}</h3>
                <p>{hotel.location}</p>
                <p>Rating: {hotel.rating}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => openEditModal(hotel)} className="btn btn-primary">Edit</button>
                <button onClick={() => handleDelete(hotel._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{currentHotel ? 'Edit Hotel' : 'Add Hotel'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} />
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

export default Hotels;
