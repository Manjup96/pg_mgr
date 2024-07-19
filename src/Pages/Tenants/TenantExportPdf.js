import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const ExportPdf = ({ tenants }) => {
  const handleExportAll = () => {
    const doc = new jsPDF();
    const tableData = tenants.map((tenant) => [
      tenant.id,
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

    doc.save('all_tenants.pdf');
  };

  return (
    <div>
      <button className="tenant-export-button" data-tooltip="Download as PDF"  onClick={handleExportAll}>
        <FontAwesomeIcon icon={faFilePdf} />
      </button>
    </div>
  );
};

export default ExportPdf;
