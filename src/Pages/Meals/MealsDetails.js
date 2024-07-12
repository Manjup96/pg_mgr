import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";

const MealsDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
       <Navbar />
       <h2>Meals Details</h2>
    </div>
  )
}

export default MealsDetails
