import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";

const TenantDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
      <Navbar />
      <h2>Tenant Details</h2>
    </div>
  )
}

export default TenantDetails
