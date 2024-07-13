// import React from 'react'
// import Navbar from "../../shared/Navbar";
// import { useManagerAuth } from "../../context/AuthContext";

// const MealsDetails = () => {
//     const { manager } = useManagerAuth();
//   return (
//     <div>
//        <Navbar />
//        <h2>Meals Details</h2>
//     </div>
//   )
// }

// export default MealsDetails


import React, { useState, useEffect } from 'react';
import Navbar from '../../shared/Navbar';
import axios from 'axios';  // Import Axios for making HTTP requests
import { useManagerAuth } from '../../context/AuthContext';

const MealsDetails = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tenant Name</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
            <th>Comments</th>
            <th>Date</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default MealsDetails;





