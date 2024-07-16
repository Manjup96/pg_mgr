import React, { useState, useEffect } from 'react';
import Navbar from '../../shared/Navbar';
import axios from 'axios';
import { useManagerAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/Meals.scss';

const MealsDetails = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

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
  };

  const filteredMeals = meals.filter((meal) =>
    ['autoIncrementId', 'tenant_name', 'breakfast', 'lunch', 'dinner', 'comments', 'date']
      .map(field => meal[field]?.toString().toLowerCase())
      .some(value => value.includes(searchQuery.toLowerCase()))
  );

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
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        className="meals-search-input"
      />
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
            {filteredMeals.map((meal, index) => (
              <tr key={index}>
                <td>{meal.autoIncrementId}</td>
                <td>{meal.tenant_name}</td>
                <td>{meal.breakfast}</td>
                <td>{meal.lunch}</td>
                <td>{meal.dinner}</td>
                <td>{meal.comments}</td>
                <td>{meal.date}</td>
                <td>
                  <button onClick={() => handleViewDetails(meal)}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
