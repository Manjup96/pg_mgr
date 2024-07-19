import React from 'react'
import Navbar from "../../shared/Navbar";
import '../../styles/components/AccountsDetails.scss';
import { useManagerAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom';

const AccountsDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
      <Navbar />
      <h1 className='heading-accountdetails' >Account Details</h1>
      
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
