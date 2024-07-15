import React, { useState, useEffect } from 'react';
import "../../styles/components/EditNewsModal.scss";

const EditNewsModal = ({ news, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    news_type: '',
    news_description: '',
    created_at: ''
  });

  useEffect(() => {
    if (news) {
      setFormData({
        news_type: news.news_type,
        news_description: news.news_description,
        created_at: news.created_at
      });
    }
  }, [news]);

  const handleSave = async () => {
    try {
      let response;
      if (news) {
        response = await fetch('https://iiiqbets.com/pg-management/UPDATE-NEWS-API.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: news.id,
            ...formData
          })
        });
      } else {
        response = await fetch('https://iiiqbets.com/pg-management/NEWS-manager-building-POST-API.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }

      if (response.ok) {
        const updatedNews = await response.json();
        onUpdate(updatedNews);
        onClose();
        alert(news ? "News Updated Successfully" : "News Registered Successfully");
      } else {
        console.error('Failed to save news');
        alert("Failed to save news.");
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert("Failed to save news.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{news ? 'Edit News' : 'Add News'}</h2>
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
          {!news && (
            <div className="form-group">
              <label>Created At</label>
              <input
                type="date"
                name="created_at"
                value={formData.created_at}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-actions">
            <button type="button" onClick={handleSave}>{news ? 'Update' : 'Add'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNewsModal;
