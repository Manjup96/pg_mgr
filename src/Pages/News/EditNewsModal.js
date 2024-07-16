import React, { useState } from 'react';
import "../../styles/components/EditNewsModal.scss";

const EditNewsModal = ({ news, onClose, onUpdate }) => {
  const [newsType, setNewsType] = useState(news.news_type);
  const [newsDescription, setNewsDescription] = useState(news.news_description);
  const [createdAt, setCreatedAt] = useState(news.created_at);

  const handleUpdate = async () => {
    try {
      const response = await fetch('https://iiiqbets.com/pg-management/UPDATE-NEWS-API.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: news.id,
          news_type: newsType,
          created_at: createdAt,
          news_description: newsDescription
        })
      });

      if (response.ok) {
        const updatedNews = {
          ...news,
          news_type: newsType,
          created_at: createdAt,
          news_description: newsDescription
        };
        onUpdate(updatedNews);
      } else {
        console.error('Failed to update news');
      }
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit News</h2>
        <form>
          <div className="form-group">
            <label>News Type</label>
            <input
              type="text"
              value={newsType}
              onChange={(e) => setNewsType(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>News Description</label>
            <textarea
              value={newsDescription}
              onChange={(e) => setNewsDescription(e.target.value)}
            />
          </div>
          {/* <div className="form-group">
                        <label>Created At</label>
                        <input
                            type="date"
                            value={createdAt}
                            onChange={(e) => setCreatedAt(e.target.value)}
                        />
                    </div> */}
          <div className="form-actions">
            <button type="button" onClick={handleUpdate}>Update</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNewsModal;