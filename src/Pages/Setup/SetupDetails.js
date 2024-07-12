import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";

const SetupDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
            <Navbar />
            <h2>Setup Details</h2>
    </div>
  )
}

export default SetupDetails
