

import React, { useState, useEffect } from 'react';
import Navbar from "../../shared/Navbar";
import '../../styles/components/EnquiryDetails.scss';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faTable, faTh } from "@fortawesome/free-solid-svg-icons"
import { View, StyleSheet } from "@react-pdf/renderer";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import EnquiryForm from './EnquiryForm';

const EnquiryDetails = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [view, setView] = useState('table');
    const [searchTerm, setSearchTerm] = useState("");



    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await axios.post('https://iiiqbets.com/pg-management/Enquiry-Tenant-Details-GET.php', {
                manager_email: 'ssy.balu@gmail.com',
                building_name: 'building 2'
            });
            setEnquiries(response.data);
        } catch (error) {
            console.error("There was an error fetching the enquiry data!", error);
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

    const filteredEnquiries = enquiries.filter((enquiry) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          (enquiry.id && enquiry.incrementalId.toString().includes(lowerSearchTerm)) ||
          (enquiry.building_name  && enquiry.building_name.toLowerCase().includes(lowerSearchTerm)) ||
          (enquiry.Name && enquiry.Name.toLowerCase().includes(lowerSearchTerm)) ||
          (enquiry.Mobile_Number && enquiry.Mobile_Number.toLowerCase().includes(lowerSearchTerm)) ||
          (enquiry.Email && enquiry.Email.toLowerCase().includes(lowerSearchTerm)) ||
          (enquiry.Remarks && enquiry.Remarks.toLowerCase().includes(lowerSearchTerm)) ||
          (enquiry.Reference && enquiry.Reference.toLowerCase().includes(lowerSearchTerm)) ||
          (enquiry.enquiry_date && enquiry.enquiry_date.toLowerCase().includes(lowerSearchTerm)) 



          // (meal.date && new Date(meal.date).toLocaleDateString("en-IN").toLowerCase().includes(lowerSearchTerm)) 
    
    
        );
      });
      const styles = StyleSheet.create({
        table: {
          display: "table",
          width: "auto",
          borderStyle: "solid",
          borderWidth: 1,
          borderRightWidth: 0,
          borderBottomWidth: 0,
        },
        tableRow: {
          flexDirection: "row",
        },
        tableCol: {
          width: "20%", // Default width for most columns
          borderStyle: "solid",
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        },
        idCol: {
          width: "10%", // Reduced width for ID column
          borderStyle: "solid",
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        },
        descriptionCol: {
          width: "50%", // Increased width for Description column
          borderStyle: "solid",
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
        },
        tableCell: {
          margin: "auto",
          marginTop: 5,
          fontSize: 10,
        },
      });
    
      const MyDocument = ({ enquiries }) => (
        <Document>
          <Page style={{ padding: 10 }}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.idCol}>
                  <Text style={styles.tableCell}>Id</Text>
                </View>
    
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>breakfast</Text>
                </View>
                <View style={styles.descriptionCol}>
                  <Text style={styles.tableCell}>lunch</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>dinner</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>comments</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>date</Text>
                </View>
              </View>
              {enquiries.map((enquiry, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.idCol}>
                    <Text style={styles.tableCell}>{index+1}</Text>
                  </View>
    
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{enquiry.breakfast}</Text>
                  </View>
                  <View style={styles.descriptionCol}>
                    <Text style={styles.tableCell}>{enquiry.lunch}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{enquiry.dinner}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{enquiry.comments}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{enquiry.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Page>
        </Document>
      );
    
  
    return (
        <div>
            <Navbar />
            <h2>Enquiry Tenant Details</h2>


            <div>
            <div className="searchbar-meals">
            <input
              type="text"
              placeholder="Search meal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar-meals"
            />
          </div>
             {/* <PDFDownloadLink document={<MyDocument enquiry={filteredEnquiries} />} fileName="filtered_enquiry.pdf">
            {({ blob, url, loading, error }) => (
              <button className="enquiry_export_button" data-tooltip="Download as PDF">
                <FontAwesomeIcon icon={faFilePdf} />
              </button>
            )}
          </PDFDownloadLink> */}
          </div>
          <div>
      <button onClick={() => setView(view === 'table' ? 'cards' : 'table')} className="enquiry_switch_button" 
          data-tooltip={view === 'table' ? 'Switch to Cards View' : 'Switch to Table View'} >
            <FontAwesomeIcon icon={view === 'table' ? faTh : faTable} />
           </button>
          </div>
          <div>
            
            <button className="enquiry_add_btn" onClick={() => handleOpenForm()}>Add Enquiry</button>
          </div>
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
                    {enquiries.map((enquiry) => (
                        <tr key={enquiry.Id}>
                            <td>{enquiry.Id}</td>
                            <td>{enquiry.building_name}</td>
                            <td>{enquiry.Name}</td>
                            <td>{enquiry.Mobile_Number}</td>
                            <td>{enquiry.Email}</td>
                            <td>{enquiry.Remarks}</td>
                            <td>{enquiry.Reference}</td>
                            <td>{enquiry.enquiry_date}</td>
                            <td>
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
            {showForm && (
                <EnquiryForm
                    initialData={selectedEnquiry}
                    onCloseForm={handleCloseForm}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default EnquiryDetails;
