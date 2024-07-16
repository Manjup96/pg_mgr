// ComplaintsForm.js
import React, { useState } from 'react';
import '../../styles/components/ComplaintsForm.scss';

const ComplaintsForm = ({ initialData, onSubmit, onCloseForm }) => {
    const [response, setResponse] = useState(initialData?.response || '');
    const [resolveDate, setResolveDate] = useState(initialData?.resolve_date || '');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = {
                id: initialData ? initialData.id : null,
                response,
                resolve_date: resolveDate
            };

            await onSubmit(formData);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }

        onCloseForm();
        setTimeout(() => {
            alert(initialData ? "Response updated successfully" : "Response added successfully");
            window.location.reload();
        }, 100);
    };

    return (
        <div className="complaint-form">
            <div className="complaint-form-container">
                <h2>Edit Complaint Response</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="response">Response:</label>
                        <input
                            type="text"
                            id="response"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="resolveDate">Resolve Date:</label>
                        <input
                            type="date"
                            id="resolveDate"
                            value={resolveDate}
                            onChange={(e) => setResolveDate(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error.message}</p>}
                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update"}
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

export default ComplaintsForm;
