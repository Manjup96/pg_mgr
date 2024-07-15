import React, { useState } from 'react';
import "../../styles/components/EditNewsModal.scss";

const AddNewsModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    news_type: '',
    news_description: '',
    created_at: ''
  });

  const handleAdd = async () => {
    try {
      const response = await fetch('https://iiiqbets.com/pg-management/NEWS-manager-building-POST-API.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onAdd(formData);
        alert("News Registered Successfully");
      } else {
        console.error('Failed to add news');
        alert("Failed to add news item.");
      }
    } catch (error) {
      console.error('Error adding news:', error);
      alert("Failed to add news item.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add News</h2>
        <form>
          <div className="form-group">
            <label>News Type</label>
            <input
              type="text"
              name="news_type"
              value={formData.news_type}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>News Description</label>
            <textarea
              name="news_description"
              value={formData.news_description}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleAdd}>Add</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewsModal;
