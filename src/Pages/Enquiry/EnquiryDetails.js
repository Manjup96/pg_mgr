import React, { useState, useEffect } from 'react';
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import '../../styles/components/EnquiryDetails.scss';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faEdit, faTrash, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';





const EnquiryDetails = () => {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
      const fetchEnquiries = async () => {
          try {
              const response = await axios.post('https://iiiqbets.com/pg-management/Enquiry-Tenant-Details-GET.php', {
                  manager_email: "tanandbabu@yahoo.co.in",
                  building_name: "ANB1"
              });
              // Assuming the API returns the data directly as an array
              setEnquiries(response.data);
          } catch (error) {
              console.error("There was an error fetching the enquiry data!", error);
          }
      };

      fetchEnquiries();
  }, []);

  return (
      <div>
                <Navbar />

          <h2>Enquiry Tenant Details</h2>
          <table className= "tenant-table">
              <thead>
                  <tr>
                      <th>Id</th>
                      <th>Building Name</th>
                      <th>Name</th>
                      <th>Mobile Number</th>
                      <th>Email</th>
                      <th>Remarks</th>
                      <th>Reference</th>
                      <th>Enquiry Date</th>
                      <th>Actions</th>

                  </tr>
              </thead>
              <tbody>
                  {enquiries.map((enquiry, index) => (
                      <tr key={index}>
                          <td>{enquiry.Id}</td>
                          <td>{enquiry.building_name}</td>
                          <td>{enquiry.Name}</td>
                          <td>{enquiry.Mobile_Number}</td>
                          <td>{enquiry.Email}</td>
                          <td>{enquiry.Remarks}</td>
                          <td>{enquiry.Reference}</td>
                          <td>{enquiry.enquiry_date}</td>
                          <td>

                          <button className="edit-btn" >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-btn">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
};

export default EnquiryDetails;



