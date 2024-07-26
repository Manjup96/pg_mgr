
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import '../../styles/components/BarChart.scss'; // Import the CSS file

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChart = ({ data, options }) => {
  return (
    <div className="bar-chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;


