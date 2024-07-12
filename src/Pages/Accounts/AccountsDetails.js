import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";

const AccountsDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
      <Navbar />
      <h2>Account Details</h2>
    </div>
  )
}

export default AccountsDetails
