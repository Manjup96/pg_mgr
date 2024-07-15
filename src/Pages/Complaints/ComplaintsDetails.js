







import React, { useState, useEffect } from 'react';
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import ComplaintsForm from "./ComplaintsForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/ComplaintsDetails.scss';

const ComplaintsDetails = () => {
    const { manager } = useManagerAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [viewComplaint, setViewComplaint] = useState(null); // State for viewing complaint details

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
                setComplaints(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

     const handleEditClick = (complaint) => {
         setSelectedComplaint(complaint);
         setShowForm(true);
     };
   

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedComplaint(null);
    };

    const handleViewDetails = (complaint) => {
        setViewComplaint(complaint);
    };

    const handleFormSubmit = async (formData) => {
        try {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    id: selectedComplaint ? selectedComplaint.id : undefined,
                    manager_email: 'ssy.balu@gmail.com',
                    building_name: 'building 2',
                }),
            };

            const url = selectedComplaint
                ? 'https://iiiqbets.com/pg-management/send-RESPONSE-for-Complaint-by-Manager-to-Tenant.php'
                : 'https://iiiqbets.com/pg-management/Complaints-POST-API-with-manager-buiding.php';

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            if (selectedComplaint) {
                setComplaints((prev) =>
                    prev.map((complaint) =>
                        complaint.id === selectedComplaint.id ? data : complaint
                    )
                );
            } else {
                setComplaints([...complaints, data]);
            }

            handleCloseForm();

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <Navbar />
            <h2>Complaints Details</h2>
            {complaints.length === 0 ? (
                <p>No complaints found</p>
            ) : (
                <div className="complaints-table-list">
                    <table className="complaints-table">
                        <thead>
                            <tr>
                                <th>Complaint ID</th>
                                <th>Building Name</th>
                                <th>Manager Email</th>
                                <th>Floor No</th>
                                <th>Room No</th>
                                <th>Bed No</th>
                                <th>Tenant Name</th>
                                <th>Tenant Mobile</th>
                                <th className='description'>Complaint Description</th>
                                <th>Complaint Type</th>
                                <th>Response</th>
                                <th>Comments</th>
                                <th>Date</th>
                                <th>Resolve Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((complaint, index) => (
                                <tr key={index}>
                                    <td>{complaint.id}</td>
                                    <td>{complaint.building_name}</td>
                                    <td>{complaint.manager_email}</td>
                                    <td>{complaint.floor_no}</td>
                                    <td>{complaint.room_no}</td>
                                    <td>{complaint.bed_no}</td>
                                    <td>{complaint.tenant_name}</td>
                                    <td>{complaint.tenant_mobile}</td>
                                    <td>{complaint.complaint_description}</td>
                                    <td>{complaint.complaint_type}</td>
                                    <td>{complaint.response}</td>
                                    <td>{complaint.comments}</td>
                                    <td>{complaint.Date}</td>
                                    <td>{complaint.resolve_date}</td>
                                    <td>
                                    <button className="icon-button" onClick={() => handleEditClick(complaint)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
                                        {/* <button onClick={() => handleViewDetails(complaint)}>View</button> */}
                                        <button onClick={() => handleViewDetails(complaint)}>
  <FontAwesomeIcon icon={faEye} />
</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {viewComplaint && (
                <div className="complaint-form-modal-overlay">
                    <div className="complaint-form-modal-container">
                        <button className="close-button" onClick={() => setViewComplaint(null)}>Close</button>
                        <div>
                            <h2>Complaint Details</h2>
                            <p><strong>Complaint ID:</strong> {viewComplaint.id}</p>
                            <p><strong>Building Name:</strong> {viewComplaint.building_name}</p>
                            <p><strong>Manager Email:</strong> {viewComplaint.manager_email}</p>
                            <p><strong>Floor No:</strong> {viewComplaint.floor_no}</p>
                            <p><strong>Room No:</strong> {viewComplaint.room_no}</p>
                            <p><strong>Bed No:</strong> {viewComplaint.bed_no}</p>
                            <p><strong>Tenant Name:</strong> {viewComplaint.tenant_name}</p>
                            <p><strong>Tenant Mobile:</strong> {viewComplaint.tenant_mobile}</p>
                            <p><strong>Complaint Description:</strong> {viewComplaint.complaint_description}</p>
                            <p><strong>Complaint Type:</strong> {viewComplaint.complaint_type}</p>
                            <p><strong>Response:</strong> {viewComplaint.response}</p>
                            <p><strong>Comments:</strong> {viewComplaint.comments}</p>
                            <p><strong>Date:</strong> {viewComplaint.Date}</p>
                            <p><strong>Resolve Date:</strong> {viewComplaint.resolve_date}</p>
                        </div>
                    </div>
                </div>
            )}
            {showForm && (
                <div className="complaint-form-modal-overlay">
                    <div className="complaint-form-modal-container">
                        <button className="close-button" onClick={handleCloseForm}>Close</button>
                        <ComplaintsForm
                            initialData={selectedComplaint}
                            onCloseForm={handleCloseForm}
                            onSubmit={handleFormSubmit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintsDetails;
