// import React, { useState } from "react";
// import "../../styles/components/TenantDetails.scss";

// const TenantEditForm = ({ tenant, onClose, setTenants, tenants }) => {
//   const [formData, setFormData] = useState({
//     id: tenant ? tenant.id : "",
//     tenant_name: tenant ? tenant.tenant_name : "",
//     tenant_email: tenant ? tenant.tenant_email : "",
//     tenant_mobile: tenant ? tenant.tenant_mobile : "",
//     tenant_aadhar_number: tenant ? tenant.tenant_aadhar_number : "",
//     tenant_address: tenant ? tenant.tenant_address : "",
//     comments: tenant ? tenant.comments : "",
//     joining_date: tenant ? tenant.joining_date : "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         "https://iiiqbets.com/pg-management/update-TENANT-manager-buidling-API.php",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (response.ok) {
//         const updatedTenants = tenants.map((t) =>
//           t.id === formData.id ? formData : t
//         );
//         setTenants(updatedTenants);
//         alert("Tenant updated successfully!");
//         onClose();
//       } else {
//         alert("Failed to update tenant. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error updating tenant:", error);
//       alert("An error occurred while updating the tenant.");
//     }
//   };

//   return (
//     <div className="TenantEditForm-modal">
//       <div className="TenantEditForm-content">
//         {/* <h2>Edit Tenant</h2> */}
//          <h2>{tenant ? 'Edit Tenant' : 'Tenant Reg Form'}</h2>
//         <form onSubmit={handleSubmit}>
//           <label>
//             Name:
//             <input
//               type="text"
//               name="tenant_name"
//               value={formData.tenant_name}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             Email:
//             <input
//               type="email"
//               name="tenant_email"
//               value={formData.tenant_email}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             Mobile:
//             <input
//               type="text"
//               name="tenant_mobile"
//               value={formData.tenant_mobile}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             Aadhaar:
//             <input
//               type="text"
//               name="tenant_aadhar_number"
//               value={formData.tenant_aadhar_number}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             Address:
//             <textarea
//               name="tenant_address"
//               value={formData.tenant_address}
//               onChange={handleChange}
//               required
//             ></textarea>
//           </label>
//           <label>
//             Joining Date:
//             <input
//               type="date"
//               name="joining_date"
//               value={formData.joining_date}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             Comments:
//             <textarea
//               name="comments"
//               value={formData.comments}
//               onChange={handleChange}
//               required
//             ></textarea>
//           </label>
//           <div className="TenantEditForm-buttons">
//             <button type="submit">Save</button>
//             <button type="button" onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TenantEditForm;


import React, { useState } from "react";
import "../../styles/components/TenantDetails.scss";

const TenantEditForm = ({ tenant, onClose, setTenants, tenants }) => {
  const [formData, setFormData] = useState({
    id: tenant ? tenant.id : "",
    tenant_name: tenant ? tenant.tenant_name : "",
    tenant_email: tenant ? tenant.tenant_email : "",
    tenant_mobile: tenant ? tenant.tenant_mobile : "",
    tenant_aadhar_number: tenant ? tenant.tenant_aadhar_number : "",
    tenant_address: tenant ? tenant.tenant_address : "",
    comments: tenant ? tenant.comments : "",
    joining_date: tenant ? tenant.joining_date : "",
    building_name: "building 1",
    manager_email: "ssy.balu@gmail.com",
    manager_mobile_no: 8106517443,
    password: tenant ? tenant.password : "abc123", // Default password for new tenants
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiEndpoint = tenant
      ? "https://iiiqbets.com/pg-management/update-TENANT-manager-buidling-API.php"
      : "https://iiiqbets.com/pg-management/tenant_registration_POST_API_manager_mobile.php";

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (tenant) {
          // Update existing tenant
          const updatedTenants = tenants.map((t) =>
            t.id === formData.id ? formData : t
          );
          setTenants(updatedTenants);
          alert("Tenant updated successfully!");
        } else {
          // Register new tenant
          const newTenant = await response.json();
          setTenants([...tenants, newTenant]);
          alert("Tenant registered successfully!");
        }
        onClose();
      } else {
        alert("Failed to submit tenant data. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting tenant data:", error);
      alert("An error occurred while submitting the tenant data.");
    }
  };

  return (
    <div className="TenantEditForm-modal">
      <div className="TenantEditForm-content">
        <h2>{tenant ? "Edit Tenant" : "Tenant Reg Form"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="tenant_name"
              value={formData.tenant_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="tenant_email"
              value={formData.tenant_email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Mobile:
            <input
              type="text"
              name="tenant_mobile"
              value={formData.tenant_mobile}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Aadhaar:
            <input
              type="text"
              name="tenant_aadhar_number"
              value={formData.tenant_aadhar_number}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address:
            <textarea
              name="tenant_address"
              value={formData.tenant_address}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <label>
            Joining Date:
            <input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Comments:
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <div className="TenantEditForm-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantEditForm;



