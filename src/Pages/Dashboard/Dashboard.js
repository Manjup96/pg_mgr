import React, { useState } from 'react'
// import Sidebar from "../../shared/Sidebar";
 import Navbar from "../../shared/Navbar";
// import { useManagerAuth } from "../../context/AuthContext";
import { useManagerAuth } from "../../context/AuthContext";
import BuildingDropdown from './BuildingDropdown';
import BuildingDetails from './BuildingDetails'

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
      <h2>Dashboard</h2>
      <BuildingDropdown onSelectBuilding={handleSelectBuilding}/>
      <BuildingDetails selectedBuilding={selectedBuilding}/>
      </div>
    </div>
  )
}

export default Dashboard
