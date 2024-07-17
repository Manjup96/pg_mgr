import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportPDFSingle = ({ complaint }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const {
      originalIndex,
      tenant_name,
      complaint_description,
      complaint_type,
      response,
      Date,
      resolve_date,
    } = complaint;

    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['Complaint ID', originalIndex],
        ['Tenant Name', tenant_name],
        ['Complaint Description', complaint_description],
        ['Complaint Type', complaint_type],
        ['Response', response],
        ['Date', Date],
        ['Resolve Date', resolve_date],
      ],
    });

    doc.save(`complaint_${complaint.originalIndex}.pdf`);
  };

  return (
    <button className="complaints-export-button" onClick={handleExport}>
      <FontAwesomeIcon icon={faFileExport} />
    </button>
  );
};

const ExportPDFAll = ({ complaints }) => {
  const handleExportAll = () => {
    const doc = new jsPDF();
    const tableData = complaints.map(({
      originalIndex,
      tenant_name,
      complaint_description,
      complaint_type,
      response,
      Date,
      resolve_date,
    }, index) => [
      index + 1,
      tenant_name,
      complaint_description,
      complaint_type,
      response,
      Date,
      resolve_date,
    ]);

    doc.autoTable({
      head: [
        ['ID', 'Tenant Name', 'Complaint Description', 'Complaint Type', 'Response', 'Date', 'Resolve Date'],
      ],
      body: tableData,
    });

    doc.save('all_complaints.pdf');
  };

  return (
    <div>
      <button className='complaints-exportall-button' onClick={handleExportAll}><FontAwesomeIcon icon={faFileExport} /></button>
    </div>
  );
};

export { ExportPDFSingle, ExportPDFAll };
