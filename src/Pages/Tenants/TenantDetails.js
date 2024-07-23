
import React, { useState, useEffect } from "react";
import Navbar from "../../shared/Navbar";
import "../../styles/components/TenantDetails.scss";
import { useManagerAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faFilePdf, faTable, faTh, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import TenantEditForm from "./TenantsEditForm";
import ExportPdf from "./TenantExportPdf";

const TenantDetails = () => {
  const [tenants, setTenants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tenantsPerPage] = useState(8);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [viewTenant, setViewTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState('table');
  const { manager } = useManagerAuth();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch(
          "https://iiiqbets.com/pg-management/GET-Tenant-details-with-building-and-manager-email-API.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              manager_email: "ssy.balu@gmail.com",
              building_name: "Bhadra",
            }),
          }
        );
        const data = await response.json();
        const sortedData = data.sort((a, b) => b.id - a.id);
        const dataWithIncrementalId = sortedData.map((tenant, index) => ({ ...tenant, incrementalId: index + 1 }));
        setTenants(dataWithIncrementalId);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    fetchTenants();
  }, []);

  const handleOpenForm = (tenant = null) => {
    setEditingTenant(tenant);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingTenant(null);
  };

  const handleDelete = async (tenant) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete tenant details...?` );
    if (confirmDelete) {
      try {
        const response = await fetch(
          "https://iiiqbets.com/pg-management/delete-TENANT-manager-buidling-API.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: tenant.id, action: 'delete' }),
          }
        );

        if (response.ok) {
          const updatedTenants = tenants.filter(t => t.id !== tenant.id);
          setTenants(updatedTenants);
          alert("Tenant deleted successfully!");
        } else {
          const errorData = await response.json();
          console.error("Failed to delete tenant:", errorData);
          alert("Failed to delete tenant. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting tenant:", error);
        alert("An error occurred while deleting the tenant.");
      }
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    (tenant.incrementalId || "").toString().includes(searchTerm.toLowerCase()) ||
    (tenant.tenant_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.tenant_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.tenant_mobile || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.tenant_aadhar_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.tenant_address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.joining_date || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.comments || "").toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = filteredTenants.slice(indexOfFirstTenant, indexOfLastTenant);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredTenants.length / tenantsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

 

  const handleViewDetails = (tenant) => {
    setViewTenant(tenant);
  };

  const [sortBy, setSortBy] = useState({ field: null, order: null });

  const handleSort = (field) => {
    const sortOrder = sortBy.field === field && sortBy.order === 'asc' ? 'desc' : 'asc';
    setSortBy({ field, order: sortOrder });
  };

  const sortedTenants = [...currentTenants].sort((A, B) => {
    if (sortBy.field) {
      const order = sortBy.order === 'asc' ? 1 : -1;
      if (sortBy.field === 'created_date' || sortBy.field === 'resolve_date') {
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


  return (
    <div>
      <Navbar />
      <h2 className="TenantDetails-title">Tenant Details</h2>

      <div className="tenants_export_switch_add_button">
        <ExportPdf tenants={tenants} /> {/* Include the ExportPDFAll component */}
        <button onClick={() => setView(view === 'cards' ? 'table' : 'cards')} className="tenant_switch_button"
          data-tooltip={view === 'cards' ? 'Switch to cards View' : 'Switch to Table View'} >
          <FontAwesomeIcon icon={view === 'cards' ? faTh : faTable} />
        </button>
        <button onClick={() => handleOpenForm()} className="Tenant-add-button">Add Tenant</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search tenants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tenant_search_bar"
        />
      </div>

      {view === 'cards' ? (
        <div className="TenantDetails-table-container">
          <table className="TenantDetails-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('incrementalId')}>ID {getSortIcon('incrementalId')}</th>
                <th onClick={() => handleSort('tenant_name')}>Name {getSortIcon('tenant_name')}</th>
                <th onClick={() => handleSort('tenant_email')}>Email {getSortIcon('tenant_email')}</th>
                <th onClick={() => handleSort('tenant_mobile')}>Mobile {getSortIcon('tenant_mobile')}</th>
                <th onClick={() => handleSort('tenant_aadhar_number')}>Aadhaar {getSortIcon('tenant_aadhar_number')}</th>
                <th onClick={() => handleSort('tenant_address')}>Address {getSortIcon('tenant_address')}</th>
                <th onClick={() => handleSort('joining_date')}>Joining Date {getSortIcon('joining_date')}</th>
                <th onClick={() => handleSort('comments')}>Comments {getSortIcon('comments')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTenants.map((tenant) => (
                <tr key={tenant.incrementalId}>
                  <td>{tenant.incrementalId}</td>
                  <td>{tenant.tenant_name}</td>
                  <td>{tenant.tenant_email}</td>
                  <td>{tenant.tenant_mobile}</td>
                  <td>{tenant.tenant_aadhar_number}</td>
                  <td>{tenant.tenant_address}</td>
                  <td>{tenant.joining_date}</td>
                  <td>{tenant.comments}</td>
                  <td className="table-actions">
                    <button onClick={() => handleOpenForm(tenant)} className="edit-icon">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(tenant)} className="delete-icon">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className='tenant-eye-button' onClick={() => handleViewDetails(tenant)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="tenant-card-view">
          {currentTenants.map((tenant) => (
            <div key={tenant.Id} className="tenant-card">
              <div className="tenant-card-body">
                <div className="tenant-card-header">
                  ID: {tenant.incrementalId}
                </div>
                <p><strong>Name:</strong> {tenant.tenant_name}</p>
                <p><strong>Email:</strong> {tenant.tenant_email}</p>
                <p><strong>Mobile:</strong> {tenant.tenant_mobile}</p>
                <p><strong>Aadhaar:</strong> {tenant.tenant_aadhar_number}</p>
                <p><strong>Address:</strong> {tenant.tenant_address}</p>
                <p><strong>Joining Date:</strong> {tenant.joining_date}</p>
                <p><strong>Comments:</strong> {tenant.comments}</p>
                <div className="tenant-card-actions">
                  <button onClick={() => handleOpenForm(tenant)} className="edit-icon">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(tenant)} className="delete-icon">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className='tenant-eye-button' onClick={() => handleViewDetails(tenant)}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="tenants-count">
        Total Tenants : {filteredTenants.length}
      </div>

      <nav>
        <ul className="tenant_pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link tenant_page-link-1" onClick={prevPage}>
              Prev
            </button>
          </li>
          {[...Array(Math.ceil(filteredTenants.length / tenantsPerPage)).keys()].map((number) => (
            <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(number + 1)} className="page-link">
                {number + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === Math.ceil(filteredTenants.length / tenantsPerPage) ? 'disabled' : ''}`}>
            <button className="page-link tenant_page-link-2" onClick={nextPage}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {viewTenant && (
        <div className="tenant-form-modal-overlay">
          <div className="tenant-form-modal-container">
            <button className="tenant-view-close-button" onClick={() => setViewTenant(null)}>Close</button>
            <div>
              <h2>Tenant Details</h2>
              <p><strong>ID:</strong> {tenants.indexOf(viewTenant) + 1}</p>
              <p><strong>Building Name:</strong> {viewTenant.tenant_name}</p>
              <p><strong>Manager Email:</strong> {viewTenant.tenant_email}</p>
              <p><strong>Aadhaar No:</strong> {viewTenant.tenant_aadhar_number}</p>
              <p><strong>Joining Date :</strong> {viewTenant.joining_dat1}</p>
              <p><strong>Comments :</strong> {viewTenant.comments}</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <TenantEditForm
          tenant={editingTenant}
          onClose={closeModal}
          setTenants={setTenants}
          tenants={tenants}
        />
      )}
    </div>
  );
};

export default TenantDetails;
