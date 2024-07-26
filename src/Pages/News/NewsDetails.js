import React, { useEffect, useState } from 'react';
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTable, faTh, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faFileExport, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../../styles/components/NewsDetails.scss";
import EditNewsModal from './EditNewsModal.js';
import AddNewsModal from "./AddNews.js";
import { ExportPDFAll, ExportPDFSingle } from './ExportPDF.js'; // Import export components

const ViewSwitch = ({ view, onToggleView }) => {
  return (
    <button onClick={onToggleView}>
      Switch to {view === 'card' ? 'Table' : 'Card'} View
    </button>
  );
};

const NewsDetails = () => {
  const { manager } = useManagerAuth();
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [view, setView] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const enquiriesPerPage = 8; // Number of news items per page

  useEffect(() => {
    fetchNews();
  }, [manager]);

  useEffect(() => {
    const newsWithIndex = news.map((item, index) => ({ ...item, autoIncrementId: index + 1 }));
    setFilteredNews(newsWithIndex);
  }, [news]);

  const fetchNews = async () => {
    try {
      const response = await fetch('https://iiiqbets.com/pg-management/GET-NEWS-for-PG-Manager-API.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "manager_email": "ssy.balu@gmail.com",
          "building_name": "bhadra"
        })
      });
      const data = await response.json();
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

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedNews(null);
  };

  const handleUpdateNews = (updatedNews) => {
    const updatedNewsList = news.map((item) =>
      item.id === updatedNews.id ? updatedNews : item
    );
    setNews(updatedNewsList);
    handleModalClose();
  };

  const handleViewSwitch = () => {
    setView(prevMode => (prevMode === 'table' ? 'card' : 'table'));
  };

  const formatDate = (dateStr) => {
    return dateStr.replace(/-/g,'/');
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
          body: JSON.stringify({ "id": newsId })
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = news
      .map((item, index) => ({ ...item, autoIncrementId: index + 1 }))
      .filter((item) =>
        item.autoIncrementId.toString().includes(event.target.value) ||
        item.news_type.toLowerCase().includes(event.target.value.toLowerCase()) ||
        item.news_description.toLowerCase().includes(event.target.value.toLowerCase()) ||
        item.created_at.toLowerCase().includes(event.target.value.toLowerCase())
      );
    setFilteredNews(filtered);
  };

  const toggleView = () => {
    setView(view === 'card' ? 'table' : 'card');
  };

  // Calculate current page's news items
  const indexOfLastNews = currentPage * enquiriesPerPage;
  const indexOfFirstNews = indexOfLastNews - enquiriesPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredNews].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredNews(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FontAwesomeIcon icon={faSort} />;
    }
    if (sortConfig.direction === 'ascending') {
      return <FontAwesomeIcon icon={faSortUp} />;
    }
    return <FontAwesomeIcon icon={faSortDown} />;
  };

  return (
    <div>
      
      <Navbar />

      <h1 className='news-heading'>News Details</h1>
      <div className='news-all-buttons'>
      <ExportPDFAll news={news} /> {/* Export all news as PDF */}
      <button onClick={handleViewSwitch} className="news-switch-button"
      data-tooltip={view === 'table' ? 'Switch to Cards View' : 'Switch to Table View'}>
        <FontAwesomeIcon icon={view === 'table' ? faTh : faTable} />
      </button>
      <button className='add-news' onClick={() => setIsAddModalOpen(true)}>Add News</button>
      </div>
      <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className='news-search'
      />
     </div>
      <div className={`news-container ${view}`}>
        {view === 'card' ? (
          currentNews.map((item, index) => (
            <div key={index} className="news-card">
              {/* <h2><strong>ID:</strong> {item.autoIncrementId}</h2> */}
              <div className="card-header" >
                ID:  {item.autoIncrementId}
              </div>
              <p><strong>News Type:</strong> {item.news_type}</p>
              <p><strong>News Description:</strong> {item.news_description}</p>
              <p><strong>Created At:</strong> {formatDate(item.created_at)}</p>
              <div className="news-icon-buttons">
                <ExportPDFSingle newsItem={item} /> {/* Export as PDF per news item */}
                <button className="edit-button" onClick={() => handleEditClick(item)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-button" onClick={() => handleDeleteNews(item.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <table className="news-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('autoIncrementId')}>ID {getSortIcon('autoIncrementId')}</th>
                <th onClick={() => handleSort('news_type')}>News Type {getSortIcon('news_type')}</th>
                <th onClick={() => handleSort('news_description')}>News Description {getSortIcon('news_description')}</th>
                <th onClick={() => handleSort('created_at')}>Created At {getSortIcon('created_at')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentNews.map((item, index) => (
                <tr key={index}>
                  <td>{item.autoIncrementId}</td>
                  <td>{item.news_type}</td>
                  <td>{item.news_description}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td className='news-actions-buttons'>
                    <ExportPDFSingle newsItem={item} /> {/* Export as PDF per news item */}
                    <button className="edit-button" onClick={() => handleEditClick(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteNews(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination */}
      <div className="news-count">
                Total Items: {filteredNews.length}
              </div>
      <nav >
        <ul className="pagination1">
          <li className={`page-item1 ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link-1 page-link1" onClick={() => paginate(currentPage - 1)}>
              Prev
            </button>
          </li>
          {[...Array(Math.ceil(filteredNews.length / enquiriesPerPage)).keys()].map((number) => (
            <li key={number} className={`page-item1 ${currentPage === number + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(number + 1)} className="page-link-1">
                {number + 1}
              </button>
            </li>
          ))}
          <li className={`page-item1 ${currentPage === Math.ceil(filteredNews.length / enquiriesPerPage) ? 'disabled' : ''}`}>
            <button className="page-link-1 page-link2" onClick={() => paginate(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      {/* Modals */}
      {isEditModalOpen && (
        <EditNewsModal
          news={selectedNews}
          onClose={handleModalClose}
          onUpdate={handleUpdateNews}
        />
      )}
      {isAddModalOpen && (
        <AddNewsModal
          managerEmail="tanandbabu@yahoo.co.in"
          buildingName="ANB1"
          onClose={() => setIsAddModalOpen(false)}
          onAdd={() => fetchNews()} // Refresh news list after adding
        />
      )}
    </div>
  );
};

export default NewsDetails;
