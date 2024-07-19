import React, { useState } from 'react';
import '../../styles/components/IncomeForm.scss';

const IncomeForm = ({ onSubmit, onCloseForm }) => {
    const [formData, setFormData] = useState({
        manager_email: "ssy.balu@gmail.com",
        building_name: "",
        tenant_mobile: "",
        tenant_name: "",
        tenant_email: "",
        date: "",
        type: "Monthly Rent",
        month: "",
        year: "",
        income_amount: "",
        comments: "",
        razorpay_payment_id: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
        onCloseForm();
        setTimeout(() => {
            alert("Income added successfully");
        }, 100);
    };

    return (
        <div className="income-form">
            <div className="income-form-container">
                <h2>Add Income</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="tenant_name">Tenant Name:</label>
                        <input
                            type="text"
                            id="tenant_name"
                            name="tenant_name"
                            value={formData.tenant_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tenant_mobile">Tenant Mobile:</label>
                        <input
                            type="text"
                            id="tenant_mobile"
                            name="tenant_mobile"
                            value={formData.tenant_mobile}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tenant_email">Tenant Email:</label>
                        <input
                            type="email"
                            id="tenant_email"
                            name="tenant_email"
                            value={formData.tenant_email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="month">Month:</label>
                        <input
                            type="text"
                            id="month"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="year">Year:</label>
                        <input
                            type="text"
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="income_amount">Income Amount:</label>
                        <input
                            type="text"
                            id="income_amount"
                            name="income_amount"
                            value={formData.income_amount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comments">Comments:</label>
                        <textarea
                            id="comments"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    {error && <p className="error-message">{error.message}</p>}
                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Income"}
                        </button>
                        <button type="button" className="close-button" onClick={onCloseForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IncomeForm;
