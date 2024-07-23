import React, { useState, useEffect } from 'react';
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import ComplaintsForm from "./ComplaintsForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faChevronLeft, faChevronRight, faThList, faThLarge, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ExportPDFSingle, ExportPDFAll } from './ExportPDF';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedComplaints, setExpandedComplaints] = useState({});
  const [viewMode, setViewMode] = useState('table'); // Add state for view mode

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
    if (currentPage < Math.ceil(filteredComplaints.length / complaintsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleToggleReadMore = (id) => {
    setExpandedComplaints((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const formatDate = (dateStr) => {
    return dateStr.replace(/-/g,'/');
};

  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredComplaints.length / complaintsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [sortBy, setSortBy] = useState({ field: null, order: null });

  const handleSort = (field) => {
    const sortOrder = sortBy.field === field && sortBy.order === 'asc' ? 'desc' : 'asc';
    setSortBy({ field, order: sortOrder });
  };

  const sortedComplaints = [...currentComplaints].sort((A, B) => {
    if (sortBy.field) {
      const order = sortBy.order === 'asc' ? 1 : -1;
      if (sortBy.field === 'created_date' & sortBy.field === 'resolve_date') {
        const dateA = new Date(A[sortBy.field]);
        const dateB = new Date(B[sortBy.field]);
        return order * (dateA.getTime() - dateB.getTime());
      } else {
        const valueA = typeof A[sortBy.field] === 'string' ? A[sortBy.field].toLowerCase() : A[sortBy.field];
        const valueB = typeof B[sortBy.field] === 'string' ? B[sortBy.field].toLowerCase() : B[sortBy.field];
        return order * (valueA > valueB ? 1 : -1);
      }
    }
    return 0;
  });



  const getSortIcon = (field) => {
    if (sortBy.field !== field) {
      return <FontAwesomeIcon icon={faSort} />;
    }
    if (sortBy.order === 'asc') {
      return <FontAwesomeIcon icon={faSortUp} />;
    }
    return <FontAwesomeIcon icon={faSortDown} />;
  };

  const renderTable = () => (
    <div className="complaints-table-list">
      <table className="complaints-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('originalIndex')}>
              ID {getSortIcon('originalIndex')}
            </th>
            <th onClick={() => handleSort('tenant_name')}>
              Tenant Name {getSortIcon('tenant_name')}
            </th>
            <th onClick={() => handleSort('complaint_description')} className="description">
              Complaint Description {getSortIcon('complaint_description')}
            </th>
            <th onClick={() => handleSort('complaint_type')}>
              Complaint Type {getSortIcon('complaint_type')}
            </th>
            <th onClick={() => handleSort('response')}>
              Response {getSortIcon('response')}
            </th>
            <th onClick={() => handleSort('Date')}>
              Date {getSortIcon('Date')}
            </th>
            <th onClick={() => handleSort('resolve_date')}>
              Resolve Date {getSortIcon('resolve_date')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedComplaints.map((complaint) => (
            <tr key={complaint.originalIndex}>
              <td>{complaint.originalIndex}</td>
              <td>{complaint.tenant_name}</td>
              <td className="complaint-description">
                {expandedComplaints[complaint.originalIndex]
                  ? complaint.complaint_description
                  : `${complaint.complaint_description.substring(0, 20)}`}
                {complaint.complaint_description.length > 20 && (
                  <span className="read-more-link">
                    <a onClick={() => handleToggleReadMore(complaint.originalIndex)} className="btn-read-more">
                      {expandedComplaints[complaint.originalIndex] ? '...Read Less' : '...Read More'}
                    </a>
                  </span>
                )}
              </td>
              <td>{complaint.complaint_type}</td>
              <td>{complaint.response}</td>
              <td>{formatDate(complaint.Date)}</td>
              <td>{formatDate(complaint.resolve_date)}</td>
              <td className="complaints-actions">
                <ExportPDFSingle complaint={complaint} />
                <button className="complaints-icon-button" onClick={() => handleEditClick(complaint)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="complaints-eye-button" onClick={() => handleViewDetails(complaint)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );



  const renderCards = () => (
    <div className="complaints-card-list">
      {currentComplaints.map((complaint) => (
        <div key={complaint.originalIndex} className="complaint-card">
          <div className="card-header" >
          <p><strong>ID:</strong> {complaint.originalIndex}</p>
          </div>
          <p><strong>Tenant Name:</strong> {complaint.tenant_name}</p>
          <p><strong>Description:</strong> 
          {expandedComplaints[complaint.originalIndex] ? complaint.complaint_description : `${complaint.complaint_description.substring(0, 20)}`}
            {complaint.complaint_description.length > 20 && (
              <span className="read-more-link">
                <a onClick={() => handleToggleReadMore(complaint.originalIndex)} className="btn-read-more">
                  {expandedComplaints[complaint.originalIndex] ? "...Read Less" : "...Read More"}
                </a>
              </span>
            )}
          </p>
          <p><strong>Type:</strong> {complaint.complaint_type}</p>
          <p><strong>Response:</strong> {complaint.response}</p>
          <p><strong>Date:</strong> {formatDate(complaint.Date)}</p>
          <p><strong>Resolve Date:</strong> {formatDate(complaint.resolve_date)}</p>
          <div className="complaints-actions">
          <ExportPDFSingle complaint={complaint} />
            <button className="complaints-icon-button" onClick={() => handleEditClick(complaint)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className='complaints-eye-button' onClick={() => handleViewDetails(complaint)}>
              <FontAwesomeIcon icon={faEye} />
            </button>
            
          </div>
        </div>
      ))}
    </div>
  );

 

  return (
    <div>
      <Navbar />
      <h1 className='complaints-heading'>Complaints Details</h1>
      <div className='complaints-all-buttons'>
      <ExportPDFAll complaints={filteredComplaints} />
      <button
        className="complaints-switch-button" data-tooltip={viewMode === 'table' ? 'Switch to Table View' : ' Switch to Cards View'}
        onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
      >
        <FontAwesomeIcon icon={viewMode === 'table' ? faThLarge : faThList} /> 
      </button>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="complaints-search-input"
      />
     </div>
      {currentComplaints.length === 0 ? (
        <p></p>
      ) : (
        viewMode === 'table' ? renderCards() : renderTable()
      )}
       <div className="Complaints-count">
                Total Complaints: {filteredComplaints.length}
              </div>
      <nav className="cp-page">
        <ul className="complaints-pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link page-link-1" onClick={prevPage}>
              Prev
            </button>
          </li>
          {[...Array(Math.ceil(filteredComplaints.length / complaintsPerPage)).keys()].map((number) => (
            <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(number + 1)} className="page-link">
                {number + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === Math.ceil(filteredComplaints.length / complaintsPerPage) ? 'disabled' : ''}`}>
            <button className="page-link page-link-2" onClick={nextPage}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      {viewComplaint && (    
        <div className="complaint-form-modal-overlay">
          <div className="complaint-form-modal-container">
            <button className="view-close-button" onClick={() => setViewComplaint(null)}>Close</button>
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
