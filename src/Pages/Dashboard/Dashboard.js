import React, { useState } from 'react'
// import Sidebar from "../../shared/Sidebar";
 import Navbar from "../../shared/Navbar";
// import { useManagerAuth } from "../../context/AuthContext";
import { useManagerAuth } from "../../context/AuthContext";
import BuildingDropdown from './BuildingDropdown';
import BuildingDetails from './BuildingDetails'
import '../../styles/components/BarChart.scss'; // Import the CSS file



const Dashboard = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('');

  const handleSelectBuilding = (buildingName) => {
    setSelectedBuilding(buildingName);
  };
  return (
    <div>
        {/* <Sidebar /> */}
        <Navbar />
      
      <div >
      <h1 className='dashboard_heading'>Dashboard</h1>
      <BuildingDropdown onSelectBuilding={handleSelectBuilding}/>
      <BuildingDetails selectedBuilding={selectedBuilding}/>
     
      </div>
    </div>
  )
}

export default Dashboard
