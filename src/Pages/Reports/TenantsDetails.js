import React, { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Navbar from "../../shared/Navbar";
import "../../styles/components/TenantDetails.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const TenantDetails = () => {
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState('table');

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

  const filteredTenants = tenants.filter(tenant =>
    (tenant.tenant_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.tenant_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.tenant_mobile || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.tenant_aadhar_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.tenant_address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.joining_date || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.comments || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredTenants.map((tenant, index) => [
      index + 1,
      tenant.tenant_name,
      tenant.tenant_email,
      tenant.tenant_mobile,
      tenant.tenant_aadhar_number,
      tenant.tenant_address,
      tenant.joining_date,
      tenant.comments
    ]);

    doc.autoTable({
      head: [['ID', 'Name', 'Email', 'Mobile', 'Aadhaar', 'Address', 'Joining Date', 'Comments']],
      body: tableData,
    });

    doc.save('tenant-details.pdf');
  };

  return (
    <div>
      <Navbar />
      <h2 className="TenantDetails-title">Tenant Details</h2>

      <input
        type="text"
        placeholder="Search tenants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="tenant_search_bar"
      />
      <button onClick={handleExportPDF} className="export-button">
        <FontAwesomeIcon icon={faFilePdf} /> Download Tenant Report
      </button>
      {view === 'table' && (
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
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{tenant.tenant_name}</td>
                  <td>{tenant.tenant_email}</td>
                  <td>{tenant.tenant_mobile}</td>
                  <td>{tenant.tenant_aadhar_number}</td>
                  <td>{tenant.tenant_address}</td>
                  <td>{tenant.joining_date}</td>
                  <td>{tenant.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantDetails;
