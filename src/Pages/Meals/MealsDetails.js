import React, { useState, useEffect } from 'react';
import Navbar from '../../shared/Navbar';
import axios from 'axios';  // Import Axios for making HTTP requests
import { useManagerAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/Meals.scss';

const MealsDetails = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null); // State for selected meal details

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('https://iiiqbets.com/pg-management/GET-Meals-API.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            manager_email: 'tanandbabu@yahoo.co.in',
            building_name: 'ANB1',
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMeals(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // Function to handle clicking on the eye icon
  const handleViewDetails = (meal) => {
    setSelectedMeal(meal); // Set selected meal to display details
  };

  // Function to close the view details modal
  const handleCloseModal = () => {
    setSelectedMeal(null); // Clear selected meal
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
      <h1>Meals Table</h1>
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
              <th>Actions</th> {/* New column for actions */}
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal.id}>
                <td>{meal.id}</td>
                <td>{meal.tenant_name}</td>
                <td>{meal.breakfast}</td>
                <td>{meal.lunch}</td>
                <td>{meal.dinner}</td>
                <td>{meal.comments}</td>
                <td>{meal.date}</td>
                <td>
                <button onClick={() => handleViewDetails(meals)}>
  <FontAwesomeIcon icon={faEye} />
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing details */}
      {selectedMeal && (
        <div className="modal-meals">
          <div className="modal-content">
          <button onClick={handleCloseModal}>Close </button>
            {/* <span className="close" onClick={handleCloseModal}>&times;</span> */}
            <h2>Meal Details</h2>
            <p><strong>ID:</strong> {selectedMeal.id}</p>
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

