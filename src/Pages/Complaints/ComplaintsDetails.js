// import React from 'react'
// import Navbar from "../../shared/Navbar";
// import { useManagerAuth } from "../../context/AuthContext";

// const ComplaintsDetails = () => {
//     const { manager } = useManagerAuth();
//   return (
//     <div>
//         <Navbar />
//         <h2>Complaints Details</h2>
//     </div>
//   )
// }

// export default ComplaintsDetails



// import React, { useState, useEffect } from 'react';
// import Navbar from "../../shared/Navbar";
// import { useManagerAuth } from "../../context/AuthContext";
// import '../../styles/components/ComplaintsDetails.scss'; // Import your SCSS file

// const ComplaintsDetails = () => {
//     const { manager } = useManagerAuth();
//     const [complaints, setComplaints] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchComplaints = async () => {
//             try {
//                 const response = await fetch('https://iiiqbets.com/pg-management/GET-complaints-from-tennat-to-manager-API.php', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         manager_email: 'ssy.balu@gmail.com',
//                         building_name: 'building 2'
//                     }),
//                 });

//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }

//                 const data = await response.json();
//                 setComplaints(data);
//             } catch (error) {
//                 setError(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchComplaints();
//     }, []);

//     const handleToggleReadMore = (id) => {
//         // Implement toggle read more functionality if needed
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error.message}</div>;
//     }

//     return (
//         <div>
//             <Navbar />
//             <h2>Complaints Details</h2>
//             {complaints.length === 0 ? (
//                 <p>No complaints found</p>
//             ) : (
//                 <div className="complaints-table-list">
//                     <table className="complaints-table">
//                         <thead>
//                             <tr>
//                                 <th>Complaint ID</th>
//                                 <th>Building Name</th>
//                                 <th>Manager Email</th>
//                                 <th>Floor No</th>
//                                 <th>Room No</th>
//                                 <th>Bed No</th>
//                                 <th>Tenant Name</th>
//                                 <th>Tenant Mobile</th>
//                                 <th>Complaint Description</th>
//                                 <th>Complaint Type</th>
//                                 <th>Response</th>
//                                 <th>Comments</th>
//                                 <th>Date</th>
//                                 <th>Resolve Date</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {complaints.map((complaint, index) => (
//                                 <tr key={index}>
//                                     <td>{complaint.id}</td>
//                                     <td>{complaint.building_name}</td>
//                                     <td>{complaint.manager_email}</td>
//                                     <td>{complaint.floor_no}</td>
//                                     <td>{complaint.room_no}</td>
//                                     <td>{complaint.bed_no}</td>
//                                     <td>{complaint.tenant_name}</td>
//                                     <td>{complaint.tenant_mobile}</td>
//                                     <td>{complaint.complaint_description}</td>
//                                     <td>{complaint.complaint_type}</td>
//                                     <td>{complaint.response}</td>
//                                     <td>{complaint.comments}</td>
//                                     <td>{complaint.Date}</td>
//                                     <td>{complaint.resolve_date}</td>
//                                     {/* <td className="complaint-table-actions">
//                                         <button className="btn-edit-complaints" onClick={() => handleEdit(complaint.id)}>Edit</button>
//                                         <button className="btn-delete-complaints" onClick={() => handleDelete(complaint.id)}>Delete</button>
//                                     </td> */}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ComplaintsDetails;


import React, { useState, useEffect } from 'react';
import Navbar from "../../shared/Navbar";
import { useManagerAuth } from "../../context/AuthContext";
import '../../styles/components/ComplaintsDetails.scss'; // Import your SCSS file

const ComplaintsDetails = () => {
    const { manager } = useManagerAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [response, setResponse] = useState("");
    const [resolveDate, setResolveDate] = useState("");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch('https://iiiqbets.com/pg-management/GET-complaints-from-tennat-to-manager-API.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        manager_email: 'ssy.balu@gmail.com',
                        building_name: 'building 2'
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setComplaints(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const handleEdit = (complaint) => {
        setSelectedComplaint(complaint);
        setResponse(complaint.response);
        setResolveDate(complaint.resolve_date);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedComplaint) return;

        try {
            const response = await fetch('https://iiiqbets.com/pg-management/send-RESPONSE-for-Complaint-by-Manager-to-Tenant.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedComplaint.id,
                    response: response,
                    resolve_date: resolveDate
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                setComplaints((prevComplaints) =>
                    prevComplaints.map((complaint) =>
                        complaint.id === selectedComplaint.id
                            ? { ...complaint, response: response, resolve_date: resolveDate }
                            : complaint
                    )
                );
                setSelectedComplaint(null);
                setResponse("");
                setResolveDate("");
            } else {
                throw new Error('Failed to update complaint');
            }
        } catch (error) {
            setError(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <Navbar />
            <h2>Complaints Details</h2>
            {complaints.length === 0 ? (
                <p>No complaints found</p>
            ) : (
                <div className="complaints-table-list">
                    <table className="complaints-table">
                        <thead>
                            <tr>
                                <th>Complaint ID</th>
                                <th>Building Name</th>
                                <th>Manager Email</th>
                                <th>Floor No</th>
                                <th>Room No</th>
                                <th>Bed No</th>
                                <th>Tenant Name</th>
                                <th>Tenant Mobile</th>
                                <th>Complaint Description</th>
                                <th>Complaint Type</th>
                                <th>Response</th>
                                <th>Comments</th>
                                <th>Date</th>
                                <th>Resolve Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((complaint, index) => (
                                <tr key={index}>
                                    <td>{complaint.id}</td>
                                    <td>{complaint.building_name}</td>
                                    <td>{complaint.manager_email}</td>
                                    <td>{complaint.floor_no}</td>
                                    <td>{complaint.room_no}</td>
                                    <td>{complaint.bed_no}</td>
                                    <td>{complaint.tenant_name}</td>
                                    <td>{complaint.tenant_mobile}</td>
                                    <td>{complaint.complaint_description}</td>
                                    <td>{complaint.complaint_type}</td>
                                    <td>{complaint.response}</td>
                                    <td>{complaint.comments}</td>
                                    <td>{complaint.Date}</td>
                                    <td>{complaint.resolve_date}</td>
                                    <td className="complaint-table-actions">
                                        <button className="btn-edit-complaints" onClick={() => handleEdit(complaint)}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedComplaint && (
                <div className="edit-form">
                    <h3>Edit Complaint Response</h3>
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label htmlFor="response">Response:</label>
                            <input
                                type="text"
                                id="response"
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="resolveDate">Resolve Date:</label>
                            <input
                                type="date"
                                id="resolveDate"
                                value={resolveDate}
                                onChange={(e) => setResolveDate(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setSelectedComplaint(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ComplaintsDetails;
