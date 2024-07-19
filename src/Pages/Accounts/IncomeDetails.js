import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../shared/Navbar";
import '../../styles/components/IncomeDetails.scss'; // Add this line to import the CSS file for styling

const IncomeDetails = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('https://iiiqbets.com/pg-management/monthly-wise-total-income-report-GET-API.php', {
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

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <Navbar />
            <h1 className='heading-income'>IncomeDetails</h1>
        <div className="income-card-container">
            {data.map((item, index) => (
                <div className="income-card" key={index}>
                    <p><strong>Month:</strong> {item.Month} </p>
                    <p><strong>Year:</strong> {item.Year}</p>
                    <p><strong>Income:</strong>{item.Income}</p>
                </div>
            ))}
        </div>
        </div>
    );
};

export default IncomeDetails;
