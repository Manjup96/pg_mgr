import React, { useEffect, useState } from 'react';
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../../styles/components/NewsDetails.scss";
import EditNewsModal from './EditNewsModal.js';
import AddNewsModal from "./AddNews.js"

const NewsDetails = () => {
  const { manager } = useManagerAuth();
  const [news, setNews] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [manager]);

  const fetchNews = async () => {
    try {
      const response = await fetch('https://iiiqbets.com/pg-management/GET-NEWS-for-PG-Manager-API.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "manager_email": "tanandbabu@yahoo.co.in",
          "building_name": "ANB1"
        })
      });
      const data = await response.json();

      // Sort news by created_at in descending order
      const sortedNews = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNews(sortedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleEditClick = (newsItem) => {
    setSelectedNews(newsItem);
    setIsEditModalOpen(true);
  };

  const handleDeleteNews = async (newsId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this news item?");
    if (confirmDelete) {
      try {
        const response = await fetch('https://iiiqbets.com/pg-management/delete-NEWS-API.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "id": newsId
          })
        });
        if (response.ok) {
          const updatedNewsList = news.filter(item => item.id !== newsId);
          setNews(updatedNewsList);
          alert("NEWS Details Deleted Successfully");
        } else {
          alert("Failed to delete news item.");
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        alert("Failed to delete news item.");
      }
    }
  };

  const handleAddNews = async (formData) => {
    try {
      const response = await fetch('https://iiiqbets.com/pg-management/NEWS-manager-building-POST-API.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchNews(); // Refresh news list
        alert("News Registered Successfully");
        setIsAddModalOpen(false);
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
    <div>
      <Navbar />
      <h2>News Details</h2>
      <button onClick={() => setIsAddModalOpen(true)}>Add News</button>
      <div className="news-container">
        {news.map((item, index) => (
          <div key={index} className="news-card">
            <h2><strong>ID:</strong> {index + 1}</h2>
            <p><strong>News Type:</strong> {item.news_type}</p>
            <p><strong>News Description:</strong> {item.news_description}</p>
            <p><strong>Created At:</strong> {item.created_at}</p>
            <div className="icon-buttons">
              <button className="icon-button">
                <FontAwesomeIcon icon={faFileExport} />
              </button>
              <button className="icon-button" onClick={() => handleEditClick(item)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="icon-button" onClick={() => handleDeleteNews(item.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isEditModalOpen && (
        <EditNewsModal
          news={selectedNews}
          onClose={() => setIsEditModalOpen(false)}
          
        />
      )}
      {isAddModalOpen && (
        <AddNewsModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(formData) => handleAddNews(formData)}
        />
      )}
    </div>
  );
};

export default NewsDetails;

