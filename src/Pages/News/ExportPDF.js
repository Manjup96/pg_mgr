import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportPDFSingle = ({ newsItem }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const { id, news_type, news_description, created_at } = newsItem;

    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['ID', id],
        ['News Type', news_type],
        ['News Description', news_description],
        ['Created At', created_at]
      ],
    });

    doc.save(`news_${newsItem.id}.pdf`);
  };

  return (
    <button className="icon-button" onClick={handleExport}>
      <FontAwesomeIcon icon={faFileExport} />
    </button>
  );
};

const ExportPDFAll = ({ news }) => {
  const handleExportAll = () => {
    const doc = new jsPDF();
    const tableData = news.map(({ id, news_type, news_description, created_at }, index) => [
      index + 1,
      news_type,
      news_description,
      created_at
    ]);

    doc.autoTable({
      head: [['ID', 'News Type', 'News Description', 'Created At']],
      body: tableData,
    });

    doc.save('all_news.pdf');
  };

  return (
    <div>
      <button onClick={handleExportAll}>Export All as PDF</button>
    </div>
  );
};

export { ExportPDFSingle, ExportPDFAll };
