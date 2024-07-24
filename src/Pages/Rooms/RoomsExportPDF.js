import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportPDFSingle = ({ room }) => {
  const handleExport = () => {
    const doc = new jsPDF();
    const {
      tenant_name,
      tenant_mobile,
      floor_no,
      room_no,
      no_of_persons_sharing_per_room,
      bed_no,
      amount,
      paid_amount,
      due,
      Available,
    } = room;

    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['Tenant Name', tenant_name],
        ['Tenant Mobile', tenant_mobile],
        ['Floor No', floor_no],
        ['Room No', room_no],
        ['No of Persons Sharing', no_of_persons_sharing_per_room],
        ['Bed No', bed_no],
        ['Amount', amount],
        ['Paid Amount', paid_amount],
        ['Due', due],
        ['Available', Available],
      ],
    });

    doc.save(`room_${room.room_no}.pdf`);
  };

  return (
    <button className="room-export-button" onClick={handleExport}>
      <FontAwesomeIcon icon={faFileExport} />
    </button>
  );
};

const ExportPDFAll = ({ rooms }) => {
  const handleExportAll = () => {
    const doc = new jsPDF();
    const tableData = rooms.map(({
      tenant_name,
      tenant_mobile,
      floor_no,
      room_no,
      no_of_persons_sharing_per_room,
      bed_no,
      amount,
      paid_amount,
      due,
      Available,
    }, index) => [
      index + 1,
      tenant_name,
      tenant_mobile,
      floor_no,
      room_no,
      no_of_persons_sharing_per_room,
      bed_no,
      amount,
      paid_amount,
      due,
      Available,
    ]);

    doc.autoTable({
      head: [
        ['ID', 'Tenant Name', 'Tenant Mobile', 'Floor No', 'Room No', 'No of Persons Sharing', 'Bed No', 'Amount', 'Paid Amount', 'Due', 'Available'],
      ],
      body: tableData,
    });

    doc.save('all_rooms.pdf');
  };

  return (
    <div>
      <button className='rooms-exportall-button' data-tooltip="Download all as PDF" onClick={handleExportAll}>
        <FontAwesomeIcon icon={faFileExport} />
      </button>
    </div>
  );
};

export { ExportPDFSingle, ExportPDFAll };
