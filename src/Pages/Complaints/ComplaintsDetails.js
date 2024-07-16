import React, { useState, useEffect } from 'react';
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import ComplaintsForm from "./ComplaintsForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/ComplaintsDetails.scss';

const ComplaintsDetails = () => {
    const { manager } = useManagerAuth();
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [viewComplaint, setViewComplaint] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

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
            const newId = selectedComplaint ? selectedComplaint.id : complaints.length + 1;
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    id: newId,
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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        const filtered = complaints.filter((complaint) =>
            complaint.originalIndex.toString().includes(event.target.value) ||
            complaint.tenant_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            complaint.complaint_description.toLowerCase().includes(event.target.value.toLowerCase()) ||
            complaint.complaint_type.toLowerCase().includes(event.target.value.toLowerCase()) ||
            complaint.response.toLowerCase().includes(event.target.value.toLowerCase()) ||
            complaint.Date.toLowerCase().includes(event.target.value.toLowerCase()) ||
            complaint.resolve_date.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredComplaints(filtered);
        setCurrentPage(1); // Reset to first page after search
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredComplaints.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredComplaints.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <Navbar />
            <h1 className='complaints-heading'>Complaints Details</h1>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            {currentComplaints.length === 0 ? (
                <p>No complaints found</p>
            ) : (
                <div className="complaints-table-list">
                    <table className="complaints-table">
                        <thead>
                            <tr>
                                <th>Complaint ID</th>
                                <th>Tenant Name</th>
                                <th className='description'>Complaint Description</th>
                                <th>Complaint Type</th>
                                <th>Response</th>
                                <th>Date</th>
                                <th>Resolve Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentComplaints.map((complaint) => (
                                <tr key={complaint.originalIndex}>
                                    <td>{complaint.originalIndex}</td>
                                    <td>{complaint.tenant_name}</td>
                                    <td>{complaint.complaint_description}</td>
                                    <td>{complaint.complaint_type}</td>
                                    <td>{complaint.response}</td>
                                    <td>{complaint.Date}</td>
                                    <td>{complaint.resolve_date}</td>
                                    <td>
                                        <button className="icon-button" onClick={() => handleEditClick(complaint)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
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
            <div className="pagination">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="arrow-button"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(filteredComplaints.length / itemsPerPage)}
                    className="arrow-button"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
            {viewComplaint && (
                <div className="complaint-form-modal-overlay">
                    <div className="complaint-form-modal-container">
                        <button className="close-button" onClick={() => setViewComplaint(null)}>Close</button>
                        <div>
                            <h2>Complaint Details</h2>
                            <p><strong>Complaint ID:</strong> {viewComplaint.originalIndex}</p>
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
