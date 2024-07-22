import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useManagerAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const ComplaintsDetails = () => {
  const { manager } = useManagerAuth();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('https://iiiqbets.com/pg-management/GET-complaints-from-tennat-to-manager-API.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            manager_email: 'ssy.balu@gmail.com',
            building_name: 'building 2'
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const complaintsWithIndex = data.map((complaint, index) => ({ ...complaint, originalIndex: index + 1 }));
        setComplaints(complaintsWithIndex);
        setFilteredComplaints(complaintsWithIndex);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredComplaints.map((complaint) => [
      complaint.originalIndex,
      complaint.tenant_name,
      complaint.complaint_description,
      complaint.complaint_type,
      complaint.response,
      complaint.Date,
      complaint.resolve_date
    ]);

    doc.autoTable({
      head: [['ID', 'Tenant Name', 'Complaint Description', 'Complaint Type', 'Response', 'Date', 'Resolve Date']],
      body: tableData,
    });

    doc.save('complaints-details.pdf');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Complaints Details</h1>
      <button onClick={handleExportPDF} className="export-button">
        <FontAwesomeIcon icon={faFilePdf} /> Download Complaints Report
      </button>
      {filteredComplaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tenant Name</th>
              <th>Complaint Description</th>
              <th>Complaint Type</th>
              <th>Response</th>
              <th>Date</th>
              <th>Resolve Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr key={complaint.originalIndex}>
                <td>{complaint.originalIndex}</td>
                <td>{complaint.tenant_name}</td>
                <td>{complaint.complaint_description}</td>
                <td>{complaint.complaint_type}</td>
                <td>{complaint.response}</td>
                <td>{complaint.Date}</td>
                <td>{complaint.resolve_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ComplaintsDetails;
