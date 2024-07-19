import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom';

const AccountsDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
      <Navbar />
      <h2>Account Details</h2>
      
      <Link to="/incomedetails" >
      <button>IncomeDetails</button>
      </Link>
      <Link to="/expenditure" >
      <button>ExpenditureDetails</button>
      </Link>
     
    </div>
  )
}

export default AccountsDetails
