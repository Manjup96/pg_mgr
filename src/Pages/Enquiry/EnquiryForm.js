
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

    const mobileNumberPattern = /^[6789][0-9]{9}$/;
    if (!mobileNumberPattern.test(mobileNumber)) {
      alert("Mobile number must start with 6, 7, 8, or 9 and be exactly 10 digits.");
      return;
    }
    const namePattern = /^[A-Za-z\s]{2,50}$/;
    if (!namePattern.test(name)) {
      alert("Name must contain only letters and spaces, and be between 2 and 50 characters long.");
      return;
    }
  

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid Gmail address.");
      return;
    }
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
  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^[6789][0-9]{0,9}$/.test(value)) {
      setMobileNumber(value);
    }
  };
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]{0,50}$/.test(value)) {
      setName(value);
    }
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
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              pattern="^[6789][0-9]{9}$"
              maxLength="10"
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
