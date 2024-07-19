import React, { useState, useEffect } from "react";
import Navbar from "../../shared/Navbar";
import "../../styles/components/TenantDetails.scss";
import { useManagerAuth } from "../../context/AuthContext";
import TenantEditForm from "./TenantsEditForm";
import { FaEdit, FaTrash, FaFilePdf, FaTable } from 'react-icons/fa';

const TenantDetails = () => {
  const [tenants, setTenants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tenantsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div>
      <Navbar />
      <h2 className="TenantDetails-title">Tenant Details</h2>
      <div className="TenantDetails-toolbar">
        <div className="TenantDetails-actions-left">
          <FaFilePdf className="tenant-export-button" title="Export to PDF" style={{ backgroundColor: '#007bff', position: 'relative' }}  />
          <FaTable className="TenantDetails-icon" title="View as Table" />
        </div>
        <div className="TenantDetails-actions-right">
          <input 
            type="text" 
            placeholder="Search tenants..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="TenantDetails-search"
          />
          <button onClick={() => handleOpenForm()} className="TenantDetails-add-button">Add Tenant</button>
        </div>
      </div>
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
                <td>{tenant.joining_date}</td>
                <td>{tenant.comments}</td>
                <td>
                  <FaEdit onClick={() => handleOpenForm(tenant)} className=" edit-icon" style={{ marginRight: '10px' }} />
                  <FaTrash onClick={() => handleDelete(tenant)} className=" delete-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
