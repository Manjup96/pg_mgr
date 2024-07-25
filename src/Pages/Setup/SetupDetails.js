import React, { useEffect, useState } from 'react';
import Navbar from "../../shared/Navbar";
import '../../styles/components/SetupDetails.scss';
import { useManagerAuth } from "../../context/AuthContext";

const SetupDetails = () => {
    const { manager } = useManagerAuth();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('https://iiiqbets.com/pg-management/setup-rooms-GET-API.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        manager_email: "ssy.balu@gmail.com",
                        building_name: "bhadra"
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setRooms(data);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };

        fetchRooms();
    }, []);

    const handleDelete = async (roomId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this room?");
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch('https://iiiqbets.com/pg-management/single-bed-GET-DETAILS-for-DELETE-OPERATION.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: roomId
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success) {
                setRooms(rooms.filter(room => room.id !== roomId));
            } else {
                console.error('Error deleting room:', result.message);
            }
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <h2 className='setup-heading'>Setup Details</h2>
            <div className="setup-table-list">
                <table className="setup-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Floor No</th>
                            <th>Room No</th>
                            <th>Bed No</th>
                            <th>No of Persons Sharing Per Room</th>
                            <th>Fee</th>
                            <th>Building Name</th>
                            <th>Manager Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room.id}>
                                <td>{room.id}</td>
                                <td>{room.floor_no}</td>
                                <td>{room.room_no}</td>
                                <td>{room.bed_no}</td>
                                <td>{room.no_of_persons_sharing_per_room}</td>
                                <td>{room.fee}</td>
                                <td>{room.building_name}</td>
                                <td>{room.manager_email}</td>
                                <td>
                                    <button onClick={() => handleDelete(room.id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SetupDetails;
