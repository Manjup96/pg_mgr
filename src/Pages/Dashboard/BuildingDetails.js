import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/components/BuildingDropdown.scss'

const API_DATA = [
  { name: 'Total Rooms', url: 'https://iiiqbets.com/pg-management/total-rooms-GET-API.php' },
  { name: 'Total Beds', url: 'https://iiiqbets.com/pg-management/total-no-of-beds-GET-API.php' },
  { name: 'Available Beds', url: 'https://iiiqbets.com/pg-management/GET-Tenant-API-total-AVAILABLE-Beds.php' },
  { name: 'Total Income', url: 'https://iiiqbets.com/pg-management/total-income-mulitple-buildings-GET-API.php' },
  { name: 'Total Expenditure', url: 'https://iiiqbets.com/pg-management/total-expenditure-manager-mail-buidling-GET-API.php' },
  { name: 'Total Complaints', url: 'https://iiiqbets.com/pg-management/total-no-of-complaints.php' },
];

const MANAGER_EMAIL = 'ssy.balu@gmail.com';

const BuildingDetails = ({ selectedBuilding }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (selectedBuilding) {
      API_DATA.forEach((api) => {
        axios.post(api.url, { manager_email: MANAGER_EMAIL, building_name: selectedBuilding })
          .then((response) => {
            console.log(`Response for ${api.name}:`, response.data);

            if (api.name === 'Total Complaints') {
              const complaintsData = response.data;
              setData((prevData) => ({
                ...prevData,
                [api.name]: {
                  total: complaintsData['Total Complaints'] || 'N/A',
                  solved: complaintsData['Solved Complaints'] || 'N/A',
                  pending: complaintsData['Pending Complaints'] || 'N/A'
                }
              }));
            } else {
              setData((prevData) => ({
                ...prevData,
                [api.name]: response.data[0] || 'N/A'
              }));
            }
          })
          .catch((error) => {
            console.error(`Error fetching data from ${api.url}:`, error);
          });
      });
    }
  }, [selectedBuilding]);

  return (
    <div className="App">

      {selectedBuilding ? (
        <div className="card-container">
          {API_DATA.map((api) => (
            <div key={api.name} className="card">
              <h2>{api.name}</h2>
              {api.name === 'Total Complaints' ? (
                <div>
                  <p>Total Complaints: {typeof data[api.name]?.total === 'string' ? data[api.name].total : 'Loading...'}</p>
                  <p>Solved Complaints: {typeof data[api.name]?.solved === 'string' ? data[api.name].solved : 'Loading...'}</p>
                  <p>Pending Complaints: {typeof data[api.name]?.pending === 'string' ? data[api.name].pending : 'Loading...'}</p>
                </div>
              ) : (
                <p>
                  {typeof data[api.name] === 'string'
                    ? data[api.name]
                    : data[api.name] && typeof data[api.name] === 'object'
                      ? Object.entries(data[api.name])
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')
                      : 'Loading...'}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default BuildingDetails;
