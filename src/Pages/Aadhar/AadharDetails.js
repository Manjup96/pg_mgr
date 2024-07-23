import React from 'react'
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/components/AadharDetails.scss'
import { faEdit, faTrash, faEye, faFilePdf, faTable, faTh, faFileExport } from '@fortawesome/free-solid-svg-icons';

const AadharDetails = () => {
    const { manager } = useManagerAuth();
  return (
    <div>
      <Navbar />
      <h1 className='aadhar_heading_1'>Aadhar Details</h1>
      <div >
      <FontAwesomeIcon className='aadhar_export_button' icon={faFileExport} /> 
        <button  className="aadhar_switch_button">
          
         switch to cards & table
        </button>
        <button className="Aadhar-add-button">Add Aadhar</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search Aadhaar..."
          className="Aadhar_search_bar"
        />
      </div>
    </div>
  )
}

export default AadharDetails
