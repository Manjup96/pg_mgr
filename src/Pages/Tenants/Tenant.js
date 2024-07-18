import React, { useState, useEffect } from 'react';
import '../../styles/components/Tenant.scss';
import { TENANT_POST_URL, TENANT_UPDATE_URL } from "../../services/ApiUrls";

const Tenant = ({ closeModal, tenant, isLoading, setTenants }) => {
  const [formData, setFormData] = useState({
    building_name: 'Building 1',
    manager_email: 'ssy.balu@gmail.com',
    manager_mobile_no: 8147516370,
    tenant_name: '',
    tenant_email: '',
    tenant_mobile: '',
    tenant_aadhar_number: '',
    tenant_address: '',
    comments: '',
    joining_date: '',
    password: ''
  });

  useEffect(() => {
    if (tenant) {
      console.log('Setting form data:', tenant); // Debug log
      setFormData({
        building_name: 'Building 1',
        manager_email: 'ssy.balu@gmail.com',
        manager_mobile_no: 8147516370,
        tenant_name: tenant.tenant_name || '',
        tenant_email: tenant.tenant_email || '',
        tenant_mobile: tenant.tenant_mobile || '',
        tenant_aadhar_number: tenant.tenant_aadhar_number || '',
        tenant_address: tenant.tenant_address || '',
        comments: tenant.comments || '',
        joining_date: tenant.joining_date || '',
        password: '' // Do not pre-fill password
      });
    }
  }, [tenant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = tenant ? TENANT_UPDATE_URL : TENANT_POST_URL;
    const method = tenant ? 'PUT' : 'POST';
    const bodyData = tenant ? {
      id: tenant.id,
      tenant_name: formData.tenant_name,
      tenant_email: formData.tenant_email,
      tenant_mobile: formData.tenant_mobile,
      tenant_aadhar_number: formData.tenant_aadhar_number,
      tenant_address: formData.tenant_address,
      comments: formData.comments,
      joining_date: formData.joining_date
    } : formData;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        alert(`Tenant ${tenant ? 'updated' : 'registration'} successful!`);
        setTenants(prevTenants => {
          if (tenant) {
            return prevTenants.map(t => t.id === tenant.id ? result : t);
          } else {
            return [...prevTenants, result];
          }
        });
        closeModal();
      } else {
        alert(`Tenant ${tenant ? 'update' : 'registration'} failed. Please try again.`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div id="tenantModal" className={`modal ${isLoading ? 'loading' : 'show'}`}>
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        {/* <h2 className="form-title">{tenant ? 'Edit Tenant' : 'Tenant Reg Form'}</h2> */}
        {/* <h2 className="form-title">Tenant Reg Form</h2> */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form id="tenantForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="tenant_name">Name: <span>*</span></label>
              <input type="text" id="tenant_name" name="tenant_name" value={formData.tenant_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="tenant_aadhar_number">Aadhaar Card Number: <span>*</span></label>
              <input type="text" id="tenant_aadhar_number" name="tenant_aadhar_number" value={formData.tenant_aadhar_number} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="tenant_mobile">Mobile Number: <span>*</span></label>
              <input type="text" id="tenant_mobile" name="tenant_mobile" value={formData.tenant_mobile} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="tenant_email">Email: <span>*</span></label>
              <input type="email" id="tenant_email" name="tenant_email" value={formData.tenant_email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="joining_date">Joining Date:</label>
              <input type="date" id="joining_date" name="joining_date" value={formData.joining_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="tenant_address">Address: <span>*</span></label>
              <input type="text" id="tenant_address" name="tenant_address" value={formData.tenant_address} onChange={handleChange} required />
            </div>
            {!tenant && (
              <div className="form-group">
                <label htmlFor="password">Password: <span>*</span></label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="comments">Comments:</label>
              <textarea id="comments" name="comments" value={formData.comments} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="save-button">Save</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Tenant;
