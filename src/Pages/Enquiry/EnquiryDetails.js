import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";

const EnquiryDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
      <Navbar />
      <h2>Enquiry Details</h2>
    </div>
  )
}

export default EnquiryDetails
