


import React, { useState } from "react";
import '../../styles/components/EnquiryForm.scss';

const EnquiryForm = ({ initialData, onCloseForm, onSubmit }) => {
  const [name, setName] = useState(initialData ? initialData.Name : '');
  const [mobileNumber, setMobileNumber] = useState(initialData ? initialData.Mobile_Number : '');
  const [email, setEmail] = useState(initialData ? initialData.Email : '');
  const [remarks, setRemarks] = useState(initialData ? initialData.Remarks : '');
  const [reference, setReference] = useState(initialData ? initialData.Reference : '');
  const [enquiryDate, setEnquiryDate] = useState(initialData ? initialData.enquiry_date : '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await onSubmit({
      Id: initialData ? initialData.Id : null,
      Name: name,
      Mobile_Number: mobileNumber,
      Email: email,
      Remarks: remarks,
      Reference: reference,
      enquiry_date: enquiryDate,
      building_name: "building 2",
      manager_email: "ssy.balu@gmail.com"
    });

    setLoading(false);
       // Close the form before showing the alert
       onCloseForm();

       setTimeout(() => {
         alert(initialData ? "Enquiry updated successfully" : "Enquiry added successfully");
         window.location.reload();
       }, 100);
  };




  return (
    <div className="enquiry-form">
      <div className="form-container">
        <h2>{initialData ? "Edit Enquiry" : "Add Enquiry"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="enquiryDate">Enquiry Date:</label>
            <input
              type="date"
              id="enquiryDate"
              value={enquiryDate}
              onChange={(e) => setEnquiryDate(e.target.value)}
              required
            />
          </div> */}
          <div className="form-group">
            <label htmlFor="remarks">Remarks:</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="reference">Reference:</label>
            <input
              type="text"
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : initialData ? "Update" : "Submit"}
            </button>
            <button type="button" onClick={onCloseForm}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryForm;
