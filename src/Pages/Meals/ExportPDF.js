import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportPDFSingle = ({ meal }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const { autoIncrementId, tenant_name, breakfast, lunch, dinner, comments, date } = meal;

    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['ID', autoIncrementId],
        ['Tenant Name', tenant_name],
        ['Breakfast', breakfast],
        ['Lunch', lunch],
        ['Dinner', dinner],
        ['Comments', comments],
        ['Date', date],
      ],
    });

    doc.save(`meal_${meal.autoIncrementId}.pdf`);
  };

  return (
    <button className="meals-export-button" onClick={handleExport}>
      <FontAwesomeIcon icon={faFileExport} />
    </button>
  );
};

const ExportPDFAll = ({ meals }) => {
  const handleExportAll = () => {
    const doc = new jsPDF();
    const tableData = meals.map(({ autoIncrementId, tenant_name, breakfast, lunch, dinner, comments, date }, index) => [
      index + 1,
      tenant_name,
      breakfast,
      lunch,
      dinner,
      comments,
      date,
    ]);
    
    doc.autoTable({
      head: [['ID', 'Tenant Name', 'Breakfast', 'Lunch', 'Dinner', 'Comments', 'Date']],
      body: tableData,
    });

    doc.save('all_meals.pdf');
  };

  return (
    <div>
      <button className='meals-exportall-button'data-tooltip="Download as PDF" onClick={handleExportAll}><FontAwesomeIcon icon={faFileExport} /></button>
    </div>
  );
};

export { ExportPDFSingle, ExportPDFAll };
