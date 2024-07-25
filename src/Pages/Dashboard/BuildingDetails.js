

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faProcedures, faCheckCircle, faDollarSign, faMoneyBillWave, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../../styles/components/BuildingDropdown.scss';

const API_DATA = [
  { name: 'Total Rooms', url: 'https://iiiqbets.com/pg-management/total-rooms-GET-API.php', route: '/rooms', icon: faBed, color: '#007bff' },
  { name: 'Total Beds', url: 'https://iiiqbets.com/pg-management/total-no-of-beds-GET-API.php', route: '/beds', icon: faProcedures, color: '#28a745' },
  { name: 'Available Beds', url: 'https://iiiqbets.com/pg-management/GET-Tenant-API-total-AVAILABLE-Beds.php', route: '/available-beds', icon: faCheckCircle, color: '#20c997' },
  { name: 'Total Income', url: 'https://iiiqbets.com/pg-management/total-income-mulitple-buildings-GET-API.php', route: '/incomedetails', icon: faDollarSign, color: '#ffc107' },
  { name: 'Total Expenditure', url: 'https://iiiqbets.com/pg-management/total-expenditure-manager-mail-buidling-GET-API.php', route: '/expenditure', icon: faMoneyBillWave, color: '#dc3545' },
  { name: 'Total Complaints', url: 'https://iiiqbets.com/pg-management/total-no-of-complaints.php', route: '/complaints', icon: faExclamationTriangle, color: '#fd7e14' },
];

const MANAGER_EMAIL = 'ssy.balu@gmail.com';

const BuildingDetails = ({ selectedBuilding }) => {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (selectedBuilding) {
      let tempData = {};
      let promises = API_DATA.map((api) => 
        axios.post(api.url, { manager_email: MANAGER_EMAIL, building_name: selectedBuilding })
          .then((response) => {
            console.log(`Response for ${api.name}:`, response.data);
            if (api.name === 'Total Complaints') {
              const complaintsData = response.data;
              tempData[api.name] = {
                total: complaintsData['Total Complaints'] || 'N/A',
                solved: complaintsData['Solved Complaints'] || 'N/A',
                pending: complaintsData['Pending Complaints'] || 'N/A'
              };
            } else {
              tempData[api.name] = response.data[0] || 'N/A';
            }
          })
          .catch((error) => {
            console.error(`Error fetching data from ${api.url}:`, error);
          })
      );
      
      Promise.all(promises).then(() => {
        setData(tempData);
        setChartData(Object.keys(tempData).map((key) => {
          let value = tempData[key];
          if (typeof value === 'object') {
            value = value.total;
          }
          return { name: key, value: Number(value) };
        }));
      });
    }
  }, [selectedBuilding]);

  return (
    <div className="App">
      {selectedBuilding ? (
        <>
          <div className="card-container">
            {API_DATA.map((api) => (
              <Link key={api.name} to={api.route} className="card-link">
                <div className="Dashboad_card">
                  <FontAwesomeIcon icon={api.icon} size="2x" style={{ color: api.color }} />
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
              </Link>
            ))}
          </div>
          <div className="chart-container">
            <BarChart width={600} height={300} data={chartData} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {API_DATA.map((api) => (
                <Bar key={api.name} dataKey="value" fill={api.color} />
              ))}
            </BarChart>
          </div>
        </>
      ) : (
        " "
      )}
    </div>
  );
};

export default BuildingDetails;
