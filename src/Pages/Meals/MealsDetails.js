import React, { useState, useEffect } from 'react';
import Navbar from '../../shared/Navbar';
import axios from 'axios';
import { useManagerAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTable, faTh, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ExportPDFSingle, ExportPDFAll } from './ExportPDF';
import '../../styles/components/Meals.scss';

const MealsDetails = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedMeals, setExpandedMeals] = useState({});
  const [viewMode, setViewMode] = useState('card'); // 'table' or 'card'
  const mealsPerPage = 8;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('https://iiiqbets.com/pg-management/GET-Meals-API.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            manager_email: 'ssy.balu@gmail.com',
            building_name: 'bhadra'
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const mealsWithId = data.map((meal, index) => ({ ...meal, autoIncrementId: index + 1 }));
        setMeals(mealsWithId);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleViewDetails = (meal) => {
    setSelectedMeal(meal);
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleViewModeSwitch = () => {
    setViewMode(prevMode => (prevMode === 'table' ? 'card' : 'table'));
  };

  const filteredMeals = meals.filter((meal) =>
    ['autoIncrementId', 'tenant_name', 'breakfast', 'lunch', 'dinner', 'comments', 'date']
      .map(field => meal[field]?.toString().toLowerCase())
      .some(value => value.includes(searchQuery.toLowerCase()))
  );

  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredMeals.length / mealsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateStr) => {
    return dateStr.replace(/-/g,'/');
};
  const handleToggleReadMore = (id) => {
    setExpandedMeals((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const [sortBy, setSortBy] = useState({ field: null, order: null });

  const handleSort = (field) => {
    const sortOrder = sortBy.field === field && sortBy.order === 'asc' ? 'desc' : 'asc';
    setSortBy({ field, order: sortOrder });
  };

  const sortedMeals = [...currentMeals].sort((A, B) => {
    if (sortBy.field) {
      const order = sortBy.order === 'asc' ? 1 : -1;
      if (sortBy.field === '') {
        const dateA = new Date(A[sortBy.field]);
        const dateB = new Date(B[sortBy.field]);
        return order * (dateA.getTime() - dateB.getTime());
      } else {
        const valueA = typeof A[sortBy.field] === 'string' ? A[sortBy.field].toLowerCase() : A[sortBy.field];
        const valueB = typeof B[sortBy.field] === 'string' ? B[sortBy.field].toLowerCase() : B[sortBy.field];
        return order * (valueA > valueB ? 1 : -1);
      }
    }
    return 0;
  });

  const getSortIcon = (field) => {
    if (sortBy.field !== field) {
      return <FontAwesomeIcon icon={faSort} />;
    }
    if (sortBy.order === 'asc') {
      return <FontAwesomeIcon icon={faSortUp} />;
    }
    return <FontAwesomeIcon icon={faSortDown} />;
  };

  

  return (
    <div>
      <Navbar />
      <h1 className='meals-heading'>Meals Table</h1>
      <div className='meals-all-buttons'>
      <ExportPDFAll meals={filteredMeals} />
      <button onClick={handleViewModeSwitch} className="meal-switch-button"
      data-tooltip={viewMode === 'table' ? 'Switch to Cards View' : 'Switch to Table View'}>
        <FontAwesomeIcon icon={viewMode === 'table' ? faTh : faTable} />
      </button>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        className="meals-search-input"
      />
      </div>
      {viewMode === 'table' ? (
        <div className="meals-table-list">
          <table className="meals-table">
            <thead>
              <tr>
              <th onClick={() => handleSort('autoIncrementId')}>
            ID {getSortIcon('autoIncrementId')}
          </th>
                <th onClick={() => handleSort('tenant_name')}>Tenant Name {getSortIcon('tenant_name')}</th>
                <th onClick={() => handleSort('breakfast')}>Breakfast {getSortIcon('breakfast')}</th>
                <th onClick={() => handleSort('lunch')}>Lunch {getSortIcon('lunch')}</th>
                <th onClick={() => handleSort('dinner')}>Dinner {getSortIcon('dinner')}</th>
                <th onClick={() => handleSort('comments')}>Comments {getSortIcon('comments')}</th>
                <th onClick={() => handleSort('date')}>Date {getSortIcon('date')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMeals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.autoIncrementId}</td>
                  <td>{meal.tenant_name}</td>
                  <td>{meal.breakfast}</td>
                  <td>{meal.lunch}</td>
                  <td>{meal.dinner}</td>
                  <td className="meal-comments">
                {expandedMeals[meal.autoIncrementId] ? meal.comments : `${meal.comments.substring(0, 20)}`}
                {meal.comments.length > 20 && (
                  <span className="read-more-link">
                    <a onClick={() => handleToggleReadMore(meal.autoIncrementId)} className="btn-read-more">
                      {expandedMeals[meal.autoIncrementId] ? "...Read Less" : "...Read More"}
                    </a>
                  </span>
                )}
              </td>
                  <td>{formatDate(meal.date)}</td>
                  <td className='meals-actions'>
                  <ExportPDFSingle meal={meal} />
                    <button className='meals-eye-button' onClick={() => handleViewDetails(meal)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="meals-card-list">
          {currentMeals.map((meal, index) => (
            <div key={index} className="meal-card">
              <div className="card-header" >
              <p><strong>ID:</strong> {meal.autoIncrementId}</p>
              </div>
              <p><strong>Tenant Name:</strong>{meal.tenant_name}</p>
              <p><strong>Breakfast:</strong> {meal.breakfast}</p>
              <p><strong>Lunch:</strong> {meal.lunch}</p>
              <p><strong>Dinner:</strong> {meal.dinner}</p>
              <p><strong>Comments:</strong>
            {expandedMeals[meal.autoIncrementId] ? meal.comments : `${meal.comments.substring(0, 20)}`}
            {meal.comments.length > 20 && (
              <span className="read-more-link">
                <a onClick={() => handleToggleReadMore(meal.autoIncrementId)} className="btn-read-more">
                  {expandedMeals[meal.autoIncrementId] ? "...Read Less" : "...Read More"}
                </a>
              </span>
            )}
          </p>
              <p><strong>Date:</strong> {formatDate(meal.date)}</p>
              <div className="meals-actions">
              <ExportPDFSingle meal={meal} />
              <button className='meals-eye-button' onClick={() => handleViewDetails(meal)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
             
              </div>
            </div>
          ))}
        </div>
      )}
       <div className="meals-count">
                Total Meals: {filteredMeals.length}
              </div>
      <nav className="ml-page">
        <ul className="meals-pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link page-link-1" onClick={prevPage}>
              Prev
            </button>
          </li>
          {[...Array(Math.ceil(filteredMeals.length / mealsPerPage)).keys()].map((number) => (
            <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(number + 1)} className="page-link">
                {number + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === Math.ceil(filteredMeals.length / mealsPerPage) ? 'disabled' : ''}`}>
            <button className="page-link page-link-2" onClick={nextPage}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {selectedMeal && (
        <div className="modal-meals">
          <div className="modal-content">
            <button className='view-close-button' onClick={handleCloseModal}>Close</button>
            <h2>Meal Details</h2>
            <p><strong>ID:</strong> {selectedMeal.autoIncrementId}</p>
            <p><strong>Tenant Name:</strong> {selectedMeal.tenant_name}</p>
            <p><strong>Breakfast:</strong> {selectedMeal.breakfast}</p>
            <p><strong>Lunch:</strong> {selectedMeal.lunch}</p>
            <p><strong>Dinner:</strong> {selectedMeal.dinner}</p>
            <p><strong>Comments:</strong> {selectedMeal.comments}</p>
            <p><strong>Date:</strong> {selectedMeal.date}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsDetails;
