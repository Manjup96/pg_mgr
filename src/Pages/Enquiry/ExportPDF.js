// ExportPDF.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportPDFSingle = ({ enquiry }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const { incrementalId, building_name, Name, Mobile_Number, Email, Remarks, Reference, enquiry_date } = enquiry;

    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['ID', incrementalId],
        ['Building Name', building_name],
        ['Name', Name],
        ['Mobile Number', Mobile_Number],
        ['Email', Email],
        ['Remarks', Remarks],
        ['Reference', Reference],
        ['Enquiry Date', enquiry_date]
      ],
    });

    doc.save(`enquiry_${incrementalId}.pdf`);
  };

  return (
    <button className="export-btn" onClick={handleExport}>
      <FontAwesomeIcon icon={faFileExport} /> 
    </button>
  );
};

const ExportPDFAll = ({ enquiries }) => {
  const handleExportAll = () => {
    const doc = new jsPDF();
    const tableData = enquiries.map(({ incrementalId, building_name, Name, Mobile_Number, Email, Remarks, Reference, enquiry_date }) => [
      incrementalId,
      building_name,
      Name,
      Mobile_Number,
      Email,
      Remarks,
      Reference,
      enquiry_date
    ]);

    doc.autoTable({
      head: [['ID', 'Building Name', 'Name', 'Mobile Number', 'Email', 'Remarks', 'Reference', 'Enquiry Date']],
      body: tableData,
    });

    doc.save('all_enquiries.pdf');
  };

  return (
    <div>
      <button className="enquiry_export_button" onClick={handleExportAll}>
      <FontAwesomeIcon icon={faFileExport} /> 

      </button>
    </div>
  );
};

export { ExportPDFSingle, ExportPDFAll };
