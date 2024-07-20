import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportPDFSingle = ({ income, serialNumber }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const { Month, Year, Income } = income;

    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['S.No', serialNumber],
        ['Month', Month],
        ['Year', Year],
        ['Income', Income],
      ],
    });

    doc.save(`income_${Month}_${Year}.pdf`);
  };

  return (
    <button className="income-export-button" onClick={handleExport}>
      <FontAwesomeIcon icon={faFileExport} />
    </button>
  );
};

const ExportPDFAll = ({ incomes }) => {
  const handleExportAll = () => {
    const doc = new jsPDF();
    const tableData = incomes.map(({ Month, Year, Income }, index) => [
      index + 1,
      Month,
      Year,
      Income,
    ]);

    doc.autoTable({
      head: [['S.No', 'Month', 'Year', 'Income']],
      body: tableData,
    });

    doc.save('all_incomes.pdf');
  };

  return (
    <button className='income-exportall-button' data-tooltip="Download as PDF" onClick={handleExportAll}>
      <FontAwesomeIcon icon={faFileExport} />
    </button>
  );
};

export { ExportPDFSingle, ExportPDFAll };
