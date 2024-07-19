import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../shared/Navbar";
import '../../styles/components/ExpenditureDetails.scss';
import ExpenditureForm from './ExpenditureForm';

const ExpenditureDetails = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.post('https://iiiqbets.com/pg-management/monthly-wise-total-expenditure-report-GET-API.php', {
                manager_email: 'ssy.balu@gmail.com',
                building_name: 'building 2'
            });
            setData(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddExpenditure = async (formData) => {
        try {
            const response = await axios.post('https://iiiqbets.com/pg-management/Expenditure-POST-API.php', formData);
            console.log(response.data);
            alert('Expenditure added successfully!');
            // Reload or update the data after adding expenditure
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to add expenditure.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <Navbar />
            <h1 className='heading-expenditure'>Expenditure Details</h1>
            <button onClick={() => setShowForm(true)}>Add Expenditure</button>
            {showForm && (
                <ExpenditureForm
                    onSubmit={handleAddExpenditure}
                    onCloseForm={() => setShowForm(false)}
                />
            )}
            <div className="expenditure-card-container">
                {data.map((item, index) => (
                    <div className="expenditure-card" key={index}>
                        <p><strong>Month:</strong> {item.Month} </p>
                        <p><strong>Year:</strong> {item.Year}</p>
                        <p><strong>Expenditure:</strong> {item.Expenditure}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExpenditureDetails;
