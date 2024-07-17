import React, { useState, useEffect } from 'react';
import Navbar from '../../shared/Navbar';
import axios from 'axios';
import { useManagerAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTable, faTh } from '@fortawesome/free-solid-svg-icons';
import { ExportPDFSingle, ExportPDFAll } from './ExportPDF';
import '../../styles/components/Meals.scss';

const MealsDetails = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
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
            building_name: 'building 2'
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <Navbar />
      <h1 className='meals-heading'>Meals Table</h1>
      <div className='meals-all-buttons'>
      <ExportPDFAll meals={filteredMeals} />
      <button onClick={handleViewModeSwitch} className="meal-switch-button">
         {/* {viewMode === 'table' ? 'Card' : 'Table'}  */}
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
                <th>ID</th>
                <th>Tenant Name</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
                <th>Comments</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMeals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.autoIncrementId}</td>
                  <td>{meal.tenant_name}</td>
                  <td>{meal.breakfast}</td>
                  <td>{meal.lunch}</td>
                  <td>{meal.dinner}</td>
                  <td>{meal.comments}</td>
                  <td>{meal.date}</td>
                  <td className='meals-actions'>
                    <button className='meals-eye-button' onClick={() => handleViewDetails(meal)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <ExportPDFSingle meal={meal} />
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
              
              <p><strong>ID:</strong> {meal.autoIncrementId}</p>
              <p><strong>Tenant Name:</strong>{meal.tenant_name}</p>
              <p><strong>Breakfast:</strong> {meal.breakfast}</p>
              <p><strong>Lunch:</strong> {meal.lunch}</p>
              <p><strong>Dinner:</strong> {meal.dinner}</p>
              <p><strong>Comments:</strong> {meal.comments}</p>
              <p><strong>Date:</strong> {meal.date}</p>
              <div className="meals-actions">
              <button className='meals-eye-button' onClick={() => handleViewDetails(meal)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <ExportPDFSingle meal={meal} />
              </div>
            </div>
          ))}
        </div>
      )}
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
            <button onClick={handleCloseModal}>Close</button>
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
