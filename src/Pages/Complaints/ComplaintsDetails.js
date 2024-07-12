import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";

const ComplaintsDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
        <Navbar />
        <h2>Complaints Details</h2>
    </div>
  )
}

export default ComplaintsDetails
