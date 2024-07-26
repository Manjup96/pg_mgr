import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const NewsDetails = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

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
          "building_name": "Bhadra"
        })
      });
      const data = await response.json();
      const sortedNews = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNews(sortedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredNews.map((item) => [
      item.autoIncrementId,
      item.news_type,
      item.news_description,
      item.created_at.replace(/-/g, '/')
    ]);

    doc.autoTable({
      head: [['ID', 'News Type', 'News Description', 'Created At']],
      body: tableData,
    });

    doc.save('news-details.pdf');
  };

  return (
    <div>
      <h1 className='news-heading'>News Details</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className='news-search'
      />
      <button onClick={handleExportPDF} className="export-button">
        <FontAwesomeIcon icon={faFilePdf} /> Download News Report
      </button>
      <div className="news-container">
        <table className="news-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>News Type</th>
              <th>News Description</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map((item) => (
              <tr key={item.autoIncrementId}>
                <td>{item.autoIncrementId}</td>
                <td>{item.news_type}</td>
                <td>{item.news_description}</td>
                <td>{item.created_at.replace(/-/g, '/')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsDetails;
