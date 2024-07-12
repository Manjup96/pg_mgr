import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";

const ReportDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
        <Navbar />
        <h2>Reports Details</h2>
    </div>
  )
}

export default ReportDetails
