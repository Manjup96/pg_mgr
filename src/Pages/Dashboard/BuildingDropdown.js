import React, { useState, useEffect } from 'react';
import '../../styles/components/BuildingDropdown.scss'

const BuildingDropdown = ({ onSelectBuilding }) => {
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
            "manager_email": "ssy.balu@gmail.com",
          })
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setBuildings(data);
        } else {
          console.error('Unexpected response data:', data);
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
    const selectedBuildingName = e.target.value;
    setSelectedBuilding(selectedBuildingName);
    onSelectBuilding(selectedBuildingName);
  };

  return (
    <div className='Dashboard_select_building'>
      <label  htmlFor="building" className="building-label">Select Building :&nbsp;</label>
      <select id="building" value={selectedBuilding} onChange={handleChange} className="building-select">
        <option value=""> Select Building Name</option>
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
