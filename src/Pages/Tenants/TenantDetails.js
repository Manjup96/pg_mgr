import React, { useState, useEffect } from "react";
import Navbar from "../../shared/Navbar";
import "../../styles/components/TenantDetails.scss";
import { useManagerAuth } from "../../context/AuthContext";
import TenantEditForm from "./TenantsEditForm";
import ReactPaginate from "react-paginate";
import { FaEdit, FaTrash } from 'react-icons/fa';

const TenantDetails = () => {
  const [tenants, setTenants] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [tenantsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleDelete = async (tenant) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete tenant with ID: ${tenant.id}?`);
    if (confirmDelete) {
      try {
        const response = await fetch(
          "https://iiiqbets.com/pg-management/delete-TENANT-manager-buidling-API.php",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: tenant.id }),
          }
        );

        if (response.ok) {
          const updatedTenants = tenants.filter(t => t.id !== tenant.id);
          setTenants(updatedTenants);
          alert("Tenant deleted successfully!");
        } else {
          alert("Failed to delete tenant. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting tenant:", error);
        alert("An error occurred while deleting the tenant.");
      }
    }
  };

  const offset = currentPage * tenantsPerPage;
  const currentTenants = tenants.slice(offset, offset + tenantsPerPage);
  const pageCount = Math.ceil(tenants.length / tenantsPerPage);

  return (
    <div>
      <Navbar />
      <h2 className="TenantDetails-title">Tenant Details</h2>
      <div className="TenantDetails-add-button">
        <button onClick={() => handleOpenForm()}>Add Tenant</button>
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
                <td>{offset + index + 1}</td>
                <td>{tenant.tenant_name}</td>
                <td>{tenant.tenant_email}</td>
                <td>{tenant.tenant_mobile}</td>
                <td>{tenant.tenant_aadhar_number}</td>
                <td>{tenant.tenant_address}</td>
                <td>{tenant.joining_date}</td>
                <td>{tenant.comments}</td>
                <td>
                  <FaEdit onClick={() => handleOpenForm(tenant)} className="TenantDetails-icon" />
                  <FaTrash onClick={() => handleDelete(tenant)} className="TenantDetails-delete-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
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
