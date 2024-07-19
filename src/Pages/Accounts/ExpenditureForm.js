import React, { useState } from 'react';
import '../../styles/components/ExpenditureForm.scss';

const ExpenditureForm = ({ onSubmit, onCloseForm }) => {
    const [formData, setFormData] = useState({
        date: '',
        manager_email: 'ssy.balu@gmail.com',
        building_name: 'building 2',
        type: '',
        expenditure_amount: '',
        balance: null,
        comments: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="expenditure-form-container">
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Type:
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Expenditure Amount:
                    <input
                        type="number"
                        name="expenditure_amount"
                        value={formData.expenditure_amount}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Comments:
                    <input
                        type="text"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Add Expenditure</button>
                <button type="button" onClick={onCloseForm}>Cancel</button>
            </form>
        </div>
    );
};

export default ExpenditureForm;
