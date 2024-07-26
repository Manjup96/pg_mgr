import React, { useEffect, useState } from 'react';
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import { ExportPDFSingle, ExportPDFAll } from './RoomsExportPDF';
import '../../styles/components/RoomDetails.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThList, faThLarge } from '@fortawesome/free-solid-svg-icons';
import BookRoomForm from './BookRoomForm';

const RoomDetails = () => {
    const { manager } = useManagerAuth();
    const [roomDetails, setRoomDetails] = useState([]);
    const [filteredRoomDetails, setFilteredRoomDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('table');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showBookModal, setShowBookModal] = useState(false);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://iiiqbets.com/pg-management/Bed-details-GET-API-manager-email.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        manager_email: "ssy.balu@gmail.com",
                        building_name: 'bhadra'
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setRoomDetails(data);
                    setFilteredRoomDetails(data);
                } else if (typeof data === 'object' && data !== null) {
                    setRoomDetails([data]);
                    setFilteredRoomDetails([data]);
                } else {
                    setError('Unexpected response format');
                }
            } catch (error) {
                setError('Error: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, [manager.email]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        const filtered = roomDetails.filter((room) =>
            room.tenant_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            room.tenant_mobile.toLowerCase().includes(event.target.value.toLowerCase()) ||
            room.floor_no.toLowerCase().includes(event.target.value.toLowerCase()) ||
            room.room_no.toLowerCase().includes(event.target.value.toLowerCase()) ||
            room.no_of_persons_sharing_per_room.toLowerCase().includes(event.target.value.toLowerCase()) ||
            room.bed_no.toLowerCase().includes(event.target.value.toLowerCase()) ||
            room.amount.toLowerCase().includes(event.target.value.toLowerCase()) ||
            room.paid_amount.toLowerCase().includes(event.target.value.toLowerCase()) ||
            room.due.toLowerCase().includes(event.target.value.toLowerCase()) ||
            room.Available.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredRoomDetails(filtered);
    };

    const handleVacateClick = (room) => {
        const isConfirmed = window.confirm('Are you sure you want to vacate this room?');
        if (isConfirmed) {
            handleVacate(room);
        }
    };

    const handleVacate = async (room) => {
        const vacateData = {
            tenant_mobile: room.tenant_mobile,
            tenant_email: room.tenant_email,
            paid_amount: room.paid_amount,
            due: room.due
        };

        try {
            const response = await fetch('https://iiiqbets.com/pg-management/vacate-Tenant-API-without-IMAGES-Tenant-Table.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vacateData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

            // Update room details with paid_amount and due set to 0
            const updatedRoomDetails = roomDetails.map((r) =>
                r.tenant_mobile === room.tenant_mobile ? { 
                    ...r, 
                    Available: 'yes', 
                    tenant_name: '', 
                    tenant_mobile: '', 
                    paid_amount: 0, 
                    due: 0 
                } : r
            );
            setRoomDetails(updatedRoomDetails);
            setFilteredRoomDetails(updatedRoomDetails);
            alert('Vacated successfully');
        } catch (error) {
            console.error('Error vacating tenant:', error);
            alert('Error vacating tenant: ' + error.message);
        }
    };

    const handleBook = (room) => {
        setSelectedRoom(room);
        setShowBookModal(true);
    };

    const handleCloseModal = () => {
        setShowBookModal(false);
        setSelectedRoom(null);
    };

    const renderTable = () => (
        <div className="rooms-table-list">
            <table className='rooms-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tenant Name</th>
                        <th>Tenant Mobile</th>
                        <th>Floor No</th>
                        <th>Room No</th>
                        <th>No of Persons Sharing</th>
                        <th>Bed No</th>
                        <th>Amount</th>
                        <th>Paid Amount</th>
                        <th>Due</th>
                        <th>Available</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRoomDetails.map((room, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{room.tenant_name}</td>
                            <td>{room.tenant_mobile}</td>
                            <td>{room.floor_no}</td>
                            <td>{room.room_no}</td>
                            <td>{room.no_of_persons_sharing_per_room}</td>
                            <td>{room.bed_no}</td>
                            <td>{room.amount}</td>
                            <td>{room.paid_amount}</td>
                            <td>{room.amount - room.paid_amount}</td>

                            <td>
                                {room.Available === '' ? '' : (
                                    <>
                                        {room.tenant_name ? (
                                            <button
                                                className="vacate-button"
                                                onClick={() => handleVacateClick(room)}
                                                disabled={!room.tenant_name}
                                            >
                                                Vacate
                                            </button>
                                        ) : (
                                            <button
                                                className="book-button"
                                                onClick={() => handleBook(room)}
                                            >
                                                Book
                                            </button>
                                        )}
                                    </>
                                )}
                            </td>
                            <td>
                                <ExportPDFSingle room={room} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderCards = () => (
        <div className="rooms-card-list">
            {filteredRoomDetails.map((room, index) => (
                <div key={index} className="room-card">
                    <div className="card-header">
                        <p><strong>ID:</strong> {index + 1}</p>
                    </div>
                    <p><strong>Tenant Name:</strong> {room.tenant_name}</p>
                    <p><strong>Tenant Mobile:</strong> {room.tenant_mobile}</p>
                    <p><strong>Floor No:</strong> {room.floor_no}</p>
                    <p><strong>Room No:</strong> {room.room_no}</p>
                    <p><strong>No of Persons Sharing:</strong> {room.no_of_persons_sharing_per_room}</p>
                    <p><strong>Bed No:</strong> {room.bed_no}</p>
                    <p><strong>Amount:</strong> {room.amount}</p>
                    <p><strong>Paid Amount:</strong> {room.paid_amount}</p>
                    <p><strong>Due:</strong> {room.due}</p>
                    <p><strong>Available:</strong> {room.Available === '' ? '' : (
                        <>
                            {room.tenant_name ? (
                                <button
                                    className="vacate-button"
                                    onClick={() => handleVacateClick(room)}
                                    disabled={!room.tenant_name}
                                >
                                    Vacate
                                </button>
                            ) : (
                                <button
                                    className="book-button"
                                    onClick={() => handleBook(room)}
                                >
                                    Book
                                </button>
                            )}
                        </>
                    )}</p>
                    <div className="rooms-actions">
                        <ExportPDFSingle room={room} />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <Navbar />
            <h2 className='rooms-heading'>Rooms</h2>
            <div className='rooms-all-buttons'>
                <ExportPDFAll rooms={roomDetails} />
                <button
                    className="rooms-switch-button"
                    data-tooltip={viewMode === 'table' ? 'Switch to Cards View' : 'Switch to Table View'}
                    onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                >
                    <FontAwesomeIcon icon={viewMode === 'table' ? faThLarge : faThList} />
                </button>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search rooms..."
                    className='rooms-search-input'
                />
            </div>
            {viewMode === 'table' ? renderTable() : renderCards()}
            {showBookModal && <BookRoomForm room={selectedRoom} onClose={handleCloseModal} />}
        </div>
    );
};

export default RoomDetails;
