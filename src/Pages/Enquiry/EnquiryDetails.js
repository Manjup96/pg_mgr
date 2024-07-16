

// import React, { useState, useEffect } from 'react';
// import Navbar from "../../shared/Navbar";
// import '../../styles/components/EnquiryDetails.scss';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
// import { faTable, faTh } from "@fortawesome/free-solid-svg-icons"
// import { View, StyleSheet } from "@react-pdf/renderer";
// import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
// import EnquiryForm from './EnquiryForm';

// const EnquiryDetails = () => {
//     const [enquiries, setEnquiries] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//     const [view, setView] = useState('table');
//     const [searchTerm, setSearchTerm] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [enquiriesPerPage] = useState(8);


//     const indexOfLastEnquiry = currentPage * enquiriesPerPage;
//     const indexOfFirstEnquiry = indexOfLastEnquiry - enquiriesPerPage;
//     const currentEnquiries = filteredEnquiries.slice(indexOfFirstEnquiry, indexOfLastEnquiry);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     const prevPage = () => {
//       if (currentPage > 1) {
//         setCurrentPage(currentPage - 1);
//       }
//     };

//     const nextPage = () => {
//       if (currentPage < Math.ceil(filteredEnquiries.length / enquiriesPerPage)) {
//         setCurrentPage(currentPage + 1);
//       }
//     };



//     const fetchEnquiries = async () => {
//         try {
//             const response = await axios.post('https://iiiqbets.com/pg-management/Enquiry-Tenant-Details-GET.php', {
//                 manager_email: 'ssy.balu@gmail.com',
//                 building_name: 'building 2'
//             });
//             setEnquiries(response.data);
//         } catch (error) {
//             console.error("There was an error fetching the enquiry data!", error);
//         }
//     };


//     useEffect(() => {
//         fetchEnquiries();
//     }, []);

//     const handleDelete = async (id) => {
//         try {
//             const confirmDelete = window.confirm("Entire row will be deleted, is that OK ..?");
//             if (confirmDelete) {
//                 const response = await axios.post('https://iiiqbets.com/pg-management/delete-Tenant-Enquiry-API.php', {
//                     Id: id
//                 });
//                 if (response.status === 200) {
//                     setEnquiries(enquiries.filter((enquiry) => enquiry.Id !== id));
//                     alert("Enquiry Details Deleted Successfully");
//                 } else {
//                     throw new Error("Failed to delete enquiry");
//                 }
//             }
//         } catch (error) {
//             console.error("Error deleting enquiry:", error);
//         }
//     };

//     const handleOpenForm = (enquiry = null) => {
//         setSelectedEnquiry(enquiry);
//         setShowForm(true);
//     };

//     const handleCloseForm = () => {
//         setShowForm(false);
//         setSelectedEnquiry(null);
//     };

//     const handleFormSubmit = async (formData) => {
//         try {
//             if (formData.Id) {
//                 // Update existing enquiry
//                 const response = await axios.post('https://iiiqbets.com/pg-management/update-Tenant-Enquiry-API.php', formData);
//                 if (response.status === 200) {
//                     setEnquiries((prev) =>
//                         prev.map((enquiry) => (enquiry.Id === formData.Id ? formData : enquiry))
//                     );
//                 } else {
//                     throw new Error("Failed to update enquiry");
//                 }
//             } else {
//                 // Add new enquiry
//                 const response = await axios.post('https://iiiqbets.com/pg-management/Enquiry-Tenant-POST-API.php', formData);
//                 if (response.status === 200) {
//                     setEnquiries((prev) => [...prev, { ...formData, Id: response.data.Id }]);
//                 } else {
//                     throw new Error("Failed to add enquiry");
//                 }
//             }
//             handleCloseForm();
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };




//     return (
//         <div>
//             <Navbar />
//             <h1 className='enquiry_main_heading'>Enquiry Details</h1>


//             <div  className='export_switch_add_enquiry_buttons'>

//                 <button className="enquiry_export_button" data-tooltip="Download as PDF">
//                     <FontAwesomeIcon icon={faFilePdf} />
//                 </button>



//             <button onClick={() => setView(view === 'table' ? 'cards' : 'table')} className="enquiry_switch_button"
//                 data-tooltip={view === 'table' ? 'Switch to Cards View' : 'Switch to Table View'} >
//                 <FontAwesomeIcon icon={view === 'table' ? faTh : faTable} />
//             </button>


//                 <button className="enquiry_add_button" onClick={() => handleOpenForm()}>Add Enquiry</button>
//             </div>
//             <div>
//                 <input
//                     type="text"
//                     placeholder="Search meal"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="enquiry_search_bar"
//                 />
//             </div>



//             <table className="tenant-table">
//                 <thead>
//                     <tr>
//                         <th>Id</th>
//                         <th>Building Name</th>
//                         <th>Name</th>
//                         <th>Mobile Number</th>
//                         <th>Email</th>
//                         <th>Remarks</th>
//                         <th>Reference</th>
//                         <th>Enquiry Date</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {currentEnquiries.map((enquiry) => (
//                         <tr key={enquiry.Id}>
//                             <td>{enquiry.Id}</td>
//                             <td>{enquiry.building_name}</td>
//                             <td>{enquiry.Name}</td>
//                             <td>{enquiry.Mobile_Number}</td>
//                             <td>{enquiry.Email}</td>
//                             <td>{enquiry.Remarks}</td>
//                             <td>{enquiry.Reference}</td>
//                             <td>{enquiry.enquiry_date}</td>
//                             <td className="actions">

//                                 <button className="edit-btn" onClick={() => handleOpenForm(enquiry)}>
//                                     <FontAwesomeIcon icon={faEdit} />
//                                 </button>
//                                 <button className="delete-btn" onClick={() => handleDelete(enquiry.Id)}>
//                                     <FontAwesomeIcon icon={faTrash} />
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {showForm && (
//                 <EnquiryForm
//                     initialData={selectedEnquiry}
//                     onCloseForm={handleCloseForm}
//                     onSubmit={handleFormSubmit}
//                 />
//             )}


// <nav className="mt-4">
//               <ul className="pagination justify-content-center">
//                 <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                   <button className="page-link" onClick={prevPage}>
//                     Prev
//                   </button>
//                 </li>
//                 {[...Array(Math.ceil(filteredEnquiries.length / enquiriesPerPage)).keys()].map((number) => (
//                   <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
//                     <button onClick={() => paginate(number + 1)} className="page-link">
//                       {number + 1}
//                     </button>
//                   </li>
//                 ))}
//                 <li className={`page-item ${currentPage === Math.ceil(filteredEnquiries.length / enquiriesPerPage) ? 'disabled' : ''}`}>
//                   <button className="page-link" onClick={nextPage}>
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//         </div>
//     );
// };

// export default EnquiryDetails;



import React, { useState, useEffect } from 'react';
import Navbar from "../../shared/Navbar";
import '../../styles/components/EnquiryDetails.scss';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFilePdf, faTable, faTh } from '@fortawesome/free-solid-svg-icons';
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import EnquiryForm from './EnquiryForm';

const EnquiryDetails = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [view, setView] = useState('table');
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [enquiriesPerPage] = useState(6);





    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        manager_email: 'ssy.balu@gmail.com',
                        building_name: 'building 2'
                    }),
                };
                const response = await fetch('https://iiiqbets.com/pg-management/Enquiry-Tenant-Details-GET.php', requestOptions);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                // Sort data by id in descending order
                const sortedData = data.sort((a, b) => b.id - a.id);
                // Add incremental ID
                const dataWithIncrementalId = sortedData.map((enquiry, index) => ({ ...enquiry, incrementalId: index + 1 }));
                setEnquiries(dataWithIncrementalId);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchEnquiries();
    }, []);

    const filteredEnquiries = enquiries.filter((enquiry) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            (enquiry.id && enquiry.incrementalId.toString().includes(lowerSearchTerm)) ||
            (enquiry.building_name && enquiry.building_name.toLowerCase().includes(lowerSearchTerm)) ||
            (enquiry.Name && enquiry.Name.toLowerCase().includes(lowerSearchTerm)) ||
            (enquiry.Mobile_Number && enquiry.Mobile_Number.toLowerCase().includes(lowerSearchTerm)) ||
            (enquiry.Email && enquiry.Email.toLowerCase().includes(lowerSearchTerm)) ||
            (enquiry.Remarks && enquiry.Remarks.toLowerCase().includes(lowerSearchTerm)) ||
            (enquiry.Reference && enquiry.Reference.toLowerCase().includes(lowerSearchTerm)) ||
            (enquiry.enquiry_date && enquiry.enquiry_date.toLowerCase().includes(lowerSearchTerm))
        );
    });

    const indexOfLastEnquiry = currentPage * enquiriesPerPage;
    const indexOfFirstEnquiry = indexOfLastEnquiry - enquiriesPerPage;
    const currentEnquiries = filteredEnquiries.slice(indexOfFirstEnquiry, indexOfLastEnquiry);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredEnquiries.length / enquiriesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleDelete = async (id) => {
        try {
            const confirmDelete = window.confirm("Entire row will be deleted, is that OK ..?");
            if (confirmDelete) {
                const response = await axios.post('https://iiiqbets.com/pg-management/delete-Tenant-Enquiry-API.php', {
                    Id: id
                });
                if (response.status === 200) {
                    setEnquiries(enquiries.filter((enquiry) => enquiry.Id !== id));
                    alert("Enquiry Details Deleted Successfully");
                } else {
                    throw new Error("Failed to delete enquiry");
                }
            }
        } catch (error) {
            console.error("Error deleting enquiry:", error);
        }
    };

    const handleOpenForm = (enquiry = null) => {
        setSelectedEnquiry(enquiry);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedEnquiry(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (formData.Id) {
                // Update existing enquiry
                const response = await axios.post('https://iiiqbets.com/pg-management/update-Tenant-Enquiry-API.php', formData);
                if (response.status === 200) {
                    setEnquiries((prev) =>
                        prev.map((enquiry) => (enquiry.Id === formData.Id ? formData : enquiry))
                    );
                } else {
                    throw new Error("Failed to update enquiry");
                }
            } else {
                // Add new enquiry
                const response = await axios.post('https://iiiqbets.com/pg-management/Enquiry-Tenant-POST-API.php', formData);
                if (response.status === 200) {
                    setEnquiries((prev) => [...prev, { ...formData, Id: response.data.Id }]);
                } else {
                    throw new Error("Failed to add enquiry");
                }
            }
            handleCloseForm();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <h1 className='enquiry_main_heading'>Enquiry Details</h1>

            <div className='export_switch_add_enquiry_buttons'>
                <button className="enquiry_export_button" data-tooltip="Download as PDF">
                    <FontAwesomeIcon icon={faFilePdf} />
                </button>
                <button onClick={() => setView(view === 'table' ? 'cards' : 'table')} className="enquiry_switch_button"
                    data-tooltip={view === 'table' ? 'Switch to Cards View' : 'Switch to Table View'} >
                    <FontAwesomeIcon icon={view === 'table' ? faTh : faTable} />
                </button>
                <button className="enquiry_add_button" onClick={() => handleOpenForm()}>Add Enquiry</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Search enquiry"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="enquiry_search_bar"
                />
            </div>

            {view === 'table' ? (
                <table className="tenant-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Building Name</th>
                            <th>Name</th>
                            <th>Mobile Number</th>
                            <th>Email</th>
                            <th>Remarks</th>
                            <th>Reference</th>
                            <th>Enquiry Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEnquiries.map((enquiry) => (
                            <tr key={enquiry.incrementalId}>
                                <td>{enquiry.incrementalId}</td>
                                <td>{enquiry.building_name}</td>
                                <td>{enquiry.Name}</td>
                                <td>{enquiry.Mobile_Number}</td>
                                <td>{enquiry.Email}</td>
                                <td>{enquiry.Remarks}</td>
                                <td>{enquiry.Reference}</td>
                                <td>{enquiry.enquiry_date}</td>
                                <td className="actions">
                                    
                                    <button className="edit-btn" onClick={() => handleOpenForm(enquiry)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(enquiry.Id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="card-view">
                    {currentEnquiries.map((enquiry) => (
                        <div key={enquiry.Id} className="card">
                            <div className="card-body">
                                <h5 className="card-title">{enquiry.Name}</h5>
                                <p className="card-text">
                                    <strong>Building:</strong> {enquiry.building_name}<br />
                                    <strong>Mobile:</strong> {enquiry.Mobile_Number}<br />
                                    <strong>Email:</strong> {enquiry.Email}<br />
                                    <strong>Remarks:</strong> {enquiry.Remarks}<br />
                                    <strong>Reference:</strong> {enquiry.Reference}<br />
                                    <strong>Date:</strong> {enquiry.enquiry_date}
                                </p>
                                <div className="card-actions">
                                    <button className="edit-btn" onClick={() => handleOpenForm(enquiry)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(enquiry.Id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showForm && (
                <EnquiryForm
                    initialData={selectedEnquiry}
                    onCloseForm={handleCloseForm}
                    onSubmit={handleFormSubmit}
                />
            )}

            <nav className="mt-4">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={prevPage}>
                            Prev
                        </button>
                    </li>
                    {[...Array(Math.ceil(filteredEnquiries.length / enquiriesPerPage)).keys()].map((number) => (
                        <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(number + 1)} className="page-link">
                                {number + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === Math.ceil(filteredEnquiries.length / enquiriesPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={nextPage}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default EnquiryDetails;

