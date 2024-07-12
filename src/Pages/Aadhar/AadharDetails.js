import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";

const AadharDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
      <Navbar />
      <h2>Aadhar Details</h2>
    </div>
  )
}

export default AadharDetails
