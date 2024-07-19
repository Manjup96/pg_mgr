

import React, { useState, useEffect } from "react";
import Navbar from "../../shared/Navbar";
import "../../styles/components/TenantDetails.scss";
import { useManagerAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFilePdf, faTable, faTh } from '@fortawesome/free-solid-svg-icons';

import TenantEditForm from "./TenantsEditForm";
import ExportPdf from "./TenantExportPdf";



const TenantDetails = () => {
  const [tenants, setTenants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tenantsPerPage] = useState(8);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
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
              building_name: "Building 1",
            }),
          }
        );
        const data = await response.json();
        setTenants(data);
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
    const confirmDelete = window.confirm(`Are you sure you want to delete tenant with ID: ${tenant.id}?`);
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
    tenant.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.tenant_email.toLowerCase().includes(searchTerm.toLowerCase())
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
  const formatDate = (dateStr) => {
    return dateStr.replace(/-/g, '/');
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
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Aadhaar</th>
                <th>Address</th>
                <th>Joining Date</th>
                <th>Comments</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTenants.map((tenant, index) => (
                <tr key={index}>
                  <td>{indexOfFirstTenant + index + 1}</td>
                  <td>{tenant.tenant_name}</td>
                  <td>{tenant.tenant_email}</td>
                  <td>{tenant.tenant_mobile}</td>
                  <td>{tenant.tenant_aadhar_number}</td>
                  <td>{tenant.tenant_address}</td>
                  <td>{formatDate(tenant.joining_date)}</td>
                  <td>{tenant.comments}</td>
                  <td className="table-actions">
                    <button onClick={() => handleOpenForm(tenant)} className="edit-icon">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(tenant)} className="delete-icon">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="tenant-card-view">
          {currentTenants.map((tenant, index) => (
            <div key={index} className="tenant-card">
              <div className="tenant-card-body">
                <div className="tenant-card-header">
                  ID: {indexOfFirstTenant + index + 1}
                </div>
                <p><strong>Name:</strong> {tenant.tenant_name}</p>
                <p><strong>Email:</strong> {tenant.tenant_email}</p>
                <p><strong>Mobile:</strong> {tenant.tenant_mobile}</p>
                <p><strong>Aadhaar:</strong> {tenant.tenant_aadhar_number}</p>
                <p><strong>Address:</strong> {tenant.tenant_address}</p>
                <p><strong>Joining Date:</strong> {formatDate(tenant.joining_date)}</p>
                <p><strong>Comments:</strong> {tenant.comments}</p>
                <div className="tenant-card-actions">
                  <button onClick={() => handleOpenForm(tenant)} className="edit-icon">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(tenant)} className="delete-icon">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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


