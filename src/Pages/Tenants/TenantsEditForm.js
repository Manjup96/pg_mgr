import React, { useState, useEffect } from "react";
import "../../styles/components/TenantDetails.scss";

const TenantEditForm = ({ tenant, closeModal, setLoading, setTenants, tenants }) => {
  const [formData, setFormData] = useState({
    tenant_name: tenant.tenant_name || '',
    tenant_email: tenant.tenant_email || '',
    tenant_mobile: tenant.tenant_mobile || '',
    tenant_aadhar_number: tenant.tenant_aadhar_number || '',
    tenant_address: tenant.tenant_address || '',
    joining_date: tenant.joining_date || '',
    comments: tenant.comments || '',
  });

  useEffect(() => {
    setFormData({
      tenant_name: tenant.tenant_name || '',
      tenant_email: tenant.tenant_email || '',
      tenant_mobile: tenant.tenant_mobile || '',
      tenant_aadhar_number: tenant.tenant_aadhar_number || '',
      tenant_address: tenant.tenant_address || '',
      joining_date: tenant.joining_date || '',
      comments: tenant.comments || '',
    });
  }, [tenant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://iiiqbets.com/pg-management/update-TENANT-manager-buidling-API.php",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, id: tenant.id }),
        }
      );
      if (response.ok) {
        const updatedTenants = tenants.map((t) =>
          t.id === tenant.id ? { ...formData, id: tenant.id } : t
        );
        setTenants(updatedTenants);
        closeModal();
        alert("Tenant updated successfully!");
      } else {
        alert("Failed to update tenant. Please try again.");
      }
    } catch (error) {
      console.error("Error updating tenant:", error);
      alert("An error occurred while updating the tenant.");
    }
    setLoading(false);
  };

  return (
    <div className="TenantEditForm">
      <form onSubmit={handleSubmit}>
        <h2>Edit Tenant</h2>
        <label>
          Name:
          <input
            type="text"
            name="tenant_name"
            value={formData.tenant_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="tenant_email"
            value={formData.tenant_email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Mobile:
          <input
            type="text"
            name="tenant_mobile"
            value={formData.tenant_mobile}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Aadhaar:
          <input
            type="text"
            name="tenant_aadhar_number"
            value={formData.tenant_aadhar_number}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="tenant_address"
            value={formData.tenant_address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Joining Date:
          <input
            type="date"
            name="joining_date"
            value={formData.joining_date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Comments:
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TenantEditForm;
