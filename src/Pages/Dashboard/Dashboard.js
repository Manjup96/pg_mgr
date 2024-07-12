import React,{ useEffect } from 'react'
// import Sidebar from "../../shared/Sidebar";
 import Navbar from "../../shared/Navbar";
// import { useManagerAuth } from "../../context/AuthContext";
import { useManagerAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { manager } = useManagerAuth();
  useEffect(() => {
      if (!manager) {
      }

  }, [manager]);
  return (
    <div>
        {/* <Sidebar /> */}
        <Navbar />
      <h2>Dashboard</h2>
    </div>
  )
}

export default Dashboard
