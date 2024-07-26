// import React from 'react'
// import Navbar from "../../shared/Navbar";
// import { useManagerAuth } from "../../context/AuthContext";

// const ReportDetails = () => {
//     const { manager } = useManagerAuth();

//   return (
//     <div>
//         <Navbar />
//         <h2>Reports Details</h2>
//           </div>
//   )
// }

// export default ReportDetails



import React from 'react';
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/ReportDetails.scss'

// Sample functions for fetching and exporting data; you should replace these with actual implementations

const fetchNews = async () => {
  // Fetch news data from API
  // Replace with your actual API call
  const response = await fetch('https://iiiqbets.com/pg-management/GET-NEWS-for-PG-Manager-API.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "manager_email": "tanandbabu@yahoo.co.in",
      "building_name": "ANB1"
    })
  });
  return await response.json();
};

const fetchTenants = async () => {
  // Fetch tenant data from API
  // Replace with your actual API call
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
  return await response.json();
};

const fetchComplaints = async () => {
  // Fetch complaints data from API
  // Replace with your actual API call
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
  return await response.json();
};

const handleExportPDF = async (data, type) => {
  const doc = new jsPDF();
  let tableData = [];

  switch (type) {
    case 'news':
      tableData = data.map((item, index) => [
        index + 1,
        item.news_type,
        item.news_description,
        item.created_at.replace(/-/g, '/')
      ]);
      doc.autoTable({
        head: [['ID', 'News Type', 'News Description', 'Created At']],
        body: tableData,
      });
      doc.save('news-details.pdf');
      break;

    case 'tenants':
      tableData = data.map((tenant, index) => [
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
      break;

    case 'complaints':
      tableData = data.map((complaint, index) => [
        index + 1,
        complaint.originalIndex,
        complaint.tenant_name,
        complaint.complaint_description,
        complaint.complaint_type,
        complaint.response,
        complaint.Date,
        complaint.resolve_date
      ]);
      doc.autoTable({
        head: [['ID', 'Tenant Name', 'Complaint Description', 'Complaint Type', 'Response', 'Date', 'Resolve Date']],
        body: tableData,
      });
      doc.save('complaints-details.pdf');
      break;

    default:
      break;
  }
};

const ReportDetails = () => {
  const { manager } = useManagerAuth();

  const handleCardClick = async (type) => {
    let data = [];

    switch (type) {
      case 'news':
        data = await fetchNews();
        break;
      case 'tenants':
        data = await fetchTenants();
        break;
      case 'complaints':
        data = await fetchComplaints();
        break;
      default:
        break;
    }

    handleExportPDF(data, type);
  };

  return (
    <div>
      <Navbar />
      <h1 className='report_heading_1'>Download Reports</h1>
      {/* <h2 className='report_heading_2'>

        Download below reports in PDF format</h2> */}
      <div className="report-cards">
        <div className="report-card" onClick={() => handleCardClick('news')}>
          <h3>News Report</h3>
          <FontAwesomeIcon icon={faFilePdf} />
        </div>
        <div className="report-card" onClick={() => handleCardClick('tenants')}>
          <h3>Tenant Report</h3>
          <FontAwesomeIcon icon={faFilePdf} />
        </div>
        <div className="report-card" onClick={() => handleCardClick('complaints')}>
          <h3>Complaints Report</h3>
          <FontAwesomeIcon icon={faFilePdf} />
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
