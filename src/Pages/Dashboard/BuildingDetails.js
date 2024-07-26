import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faProcedures, faCheckCircle, faDollarSign, faMoneyBillWave, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import '../../styles/components/BuildingDropdown.scss';
import '../../styles/components/BarChart.scss'; // Import the CSS file

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const API_DATA = [
  { name: 'Total Rooms', url: 'https://iiiqbets.com/pg-management/total-rooms-GET-API.php', route: '/rooms', icon: faBed, color: '#007bff' },
  { name: 'Total Beds', url: 'https://iiiqbets.com/pg-management/total-no-of-beds-GET-API.php', route: '/setup', icon: faProcedures, color: '#28a745' },
  { name: 'Available Beds', url: 'https://iiiqbets.com/pg-management/GET-Tenant-API-total-AVAILABLE-Beds.php', route: '/setup', icon: faCheckCircle, color: '#20c997' },
  { name: 'Total Income', url: 'https://iiiqbets.com/pg-management/total-income-mulitple-buildings-GET-API.php', route: '/incomedetails', icon: faDollarSign, color: '#ffc107' },
  { name: 'Total Expenditure', url: 'https://iiiqbets.com/pg-management/total-expenditure-manager-mail-buidling-GET-API.php', route: '/expenditure', icon: faMoneyBillWave, color: '#dc3545' },
  { name: 'Total Complaints', url: 'https://iiiqbets.com/pg-management/total-no-of-complaints.php', route: '/complaints', icon: faExclamationTriangle, color: '#fd7e14' },
];

const MANAGER_EMAIL = 'ssy.balu@gmail.com';

const BuildingDetails = ({ selectedBuilding }) => {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState(null); // Initialize with null

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

        // Prepare dynamic chart data
        const categories = Object.keys(tempData).filter(key =>
          key !== 'Total Income' && key !== 'Total Expenditure' && key !== 'Total Complaints'
        );

        const values = categories.map(key => {
          if (key === 'Total Rooms' || key === 'Total Beds' || key === 'Available Beds') {
            if (typeof tempData[key] === 'object') {
              return Object.values(tempData[key]).reduce((acc, val) => acc + Number(val), 0);
            }
            return Number(tempData[key]) || 0;
          }
          return 0; // Return 0 for categories that are not 'Total Rooms', 'Total Beds', or 'Available Beds'
        });

        setChartData({
          labels: categories,
          datasets: [
            {
              label: 'Count',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      });
    }
  }, [selectedBuilding]);

  // Define chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Categories',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
        ticks: {
          stepSize: 1, // Ensures y-axis increments by 1
        },
      },
    },
  };

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
            {chartData ? <BarChart data={chartData} options={chartOptions} /> : <p>Loading chart data...</p>}
          </div>
        </>
      ) : (
        " "
      )}
    </div>
  );
};

const BarChart = ({ data, options }) => {
  return (
    <div className="bar-chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BuildingDetails;
