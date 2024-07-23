import React, { useState } from 'react';
import "../../styles/components/EditNewsModal.scss";

const AddNewsModal = ({ onClose, onAdd, managerEmail, buildingName }) => {
  const [formData, setFormData] = useState({
    news_type: '',
    news_description: '',
    created_at: new Date().toISOString().split('T')[0] 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://iiiqbets.com/pg-management/NEWS-manager-building-POST-API.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "building_name": buildingName,
          "manager_email": managerEmail,
          "manager_mobile": "8106517443",
          "news_type": formData.news_type,
          "created_at": formData.created_at,
          "news_description": formData.news_description
        })
      });

      if (response.ok) {
        alert("News Registered Successfully");
        onAdd(); 
        onClose(); 
      } else {
        console.error('Failed to add news');
        alert("Failed to add news item.");
      }
    } catch (error) {
      console.error('Error adding news:', error);
      alert("Failed to add news item.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add News</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>News Type</label>
            <input
              type="text"
              name="news_type"
              value={formData.news_type}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>News Description</label>
            <textarea
              name="news_description"
              value={formData.news_description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className='add'>Add</button>
            <button type="button" onClick={onClose} className='cls'>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewsModal;
