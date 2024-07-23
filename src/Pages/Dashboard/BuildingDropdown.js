import React, { useState, useEffect } from 'react';
import "../../styles/components/BuildingDropdown.scss"

const BuildingDropdown = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('https://iiiqbets.com/pg-management/GET-Building-details-API.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "manager_email":"asaikrishna@gmail.com",
                
             })
          });
          const data = await response.json();
        if (Array.isArray(data)) {
          setBuildings(data);
        } else {
          console.error('Unexpected response data:', response.data);
          setBuildings([]); // Set an empty array in case of unexpected response
        }
      } catch (error) {
        console.error('Error fetching the building data', error);
        setBuildings([]); // Set an empty array in case of error
      }
    };

    fetchBuildings();
  }, []);

  const handleChange = (e) => {
    setSelectedBuilding(e.target.value);
  };

  return (
    <div>
      <label htmlFor="building">Select Building:</label>
      <select id="building" value={selectedBuilding} onChange={handleChange}>
        <option value="">Select the building</option>
        {buildings.map((building, index) => (
          <option key={index} value={building.building_name}>
            {building.building_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BuildingDropdown;
