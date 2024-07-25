import React, { useState } from 'react';
import '../../styles/components/BookRoomForm.scss';

const BookRoomForm = ({ room, onClose }) => {
    const [formData, setFormData] = useState({
        building_name: 'bhadra',
        manager_email: 'ssy.balu@gmail.com',
        manager_mobile: '9876543210',
        tenant_name: '',
        tenant_email: '',
        tenant_mobile: '',
        floor_no: room ? room.floor_no : '',
        room_no: room ? room.room_no : '',
        no_of_persons_sharing_per_room: room ? room.no_of_persons_sharing_per_room : '',
        bed_no: room ? room.bed_no : '',
        amount: room ? room.amount : '', // Initialize amount from room object
        paid_amount: '',
        due: '',
        Available: 'no',
        joining_date: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://iiiqbets.com/pg-management/Alloting-Bed-to-Tenant-PUT-API.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

            // Close the modal and refresh the room details
            onClose();
        } catch (error) {
            console.error('Error booking room:', error);
            alert('Error booking room: ' + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Book Room</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tenant Name:
                        <input type="text" name="tenant_name" value={formData.tenant_name} onChange={handleChange} required />
                    </label>
                    <label>
                        Tenant Email:
                        <input type="email" name="tenant_email" value={formData.tenant_email} onChange={handleChange} required />
                    </label>
                    <label>
                        Tenant Mobile:
                        <input type="number" name="tenant_mobile" value={formData.tenant_mobile} onChange={handleChange} required />
                    </label>
                    <label>
                        Joining Date:
                        <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} required />
                    </label>
                    <label>
                        Floor Number:
                        <input type="number" name="floor_no" value={formData.floor_no} onChange={handleChange} required />
                    </label>
                    <label>
                        Room Number:
                        <input type="number" name="room_no" value={formData.room_no} onChange={handleChange} required />
                    </label>
                    <label>
                        Bed Number:
                        <input type="number" name="bed_no" value={formData.bed_no} onChange={handleChange} required />
                    </label>
                    <label>
                        Room Sharing:
                        <input type="number" name="no_of_persons_sharing_per_room" value={formData.no_of_persons_sharing_per_room} onChange={handleChange} required />
                    </label>
                    <label>
                        Total Amount:
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                    </label>
                    <label>
                        Paid Amount:
                        <input type="number" name="paid_amount" value={formData.paid_amount} onChange={handleChange} required />
                    </label>
                    <label>
                        Your Message:
                        <textarea name="message" onChange={handleChange} required />
                    </label>
                    <button type="submit">Book</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default BookRoomForm;
