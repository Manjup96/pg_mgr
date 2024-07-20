import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ExportPDFSingle for a single expenditure
const ExportPDFSingle = ({ expenditure, serialNumber }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const { Month, Year, Expenditure } = expenditure;

    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['S.No', serialNumber],
        ['Month', Month],
        ['Year', Year],
        ['Expenditure', Expenditure],
      ],
    });

    doc.save(`expenditure_${Month}_${Year}.pdf`);
  };

  return (
    <button className="expenditure-export-button" onClick={handleExport}>
      <FontAwesomeIcon icon={faFileExport} />
    </button>
  );
};

// ExportPDFAll for all expenditures
const ExportPDFAll = ({ expenditures }) => {
  const handleExportAll = () => {
    const doc = new jsPDF();
    const tableData = expenditures.map(({ Month, Year, Expenditure }, index) => [
      index + 1,
      Month,
      Year,
      Expenditure,
    ]);

    doc.autoTable({
      head: [['S.No', 'Month', 'Year', 'Expenditure']],
      body: tableData,
    });

    doc.save('all_expenditures.pdf');
  };

  return (
    <button className='expenditure-exportall-button' data-tooltip="Download as PDF" onClick={handleExportAll}>
      <FontAwesomeIcon icon={faFileExport} />
    </button>
  );
};

export { ExportPDFSingle, ExportPDFAll };
