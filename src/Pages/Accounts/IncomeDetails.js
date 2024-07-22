import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../shared/Navbar";
import IncomeForm from './IncomeForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faChevronLeft, faChevronRight, faThList, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { ExportPDFSingle, ExportPDFAll } from './IncomeExport';
import '../../styles/components/IncomeDetails.scss';

const IncomeDetails = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [viewIncome, setViewIncome] = useState(null); // State to track the income being viewed
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [viewType, setViewType] = useState('table'); // State for view type

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('https://iiiqbets.com/pg-management/monthly-wise-total-income-report-GET-API.php', {
                    manager_email: 'ssy.balu@gmail.com',
                    building_name: 'building 2'
                });
                const dataWithSerialNumbers = response.data.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1
                }));
                setData(dataWithSerialNumbers);
                setFilteredData(dataWithSerialNumbers); // Initialize filtered data
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Filter data based on search term
        const filtered = data.filter(item => 
            (item.serialNumber && item.serialNumber.toString().includes(searchTerm)) || // Search in S.No
            (item.Month || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.Year || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.Income || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        // Reset to the first page when search term changes
        setCurrentPage(1);
    }, [searchTerm, data]);

    const handleAddIncome = async (incomeData) => {
        try {
            await axios.post('https://iiqbets.com/pg-management/razorpay-orderID-tenant-fee-pay-update-API.php', incomeData);
            const newIncomeData = { ...incomeData, serialNumber: data.length + 1 };
            setData([...data, newIncomeData]); // Add new income data to the existing data
            setFilteredData([...filteredData, newIncomeData]); // Add to filtered data as well
        } catch (error) {
            setError(error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const renderTable = () => (
        <div className="income-table-list">
            <table className="income-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Income</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.serialNumber}>
                            <td>{item.serialNumber}</td>
                            <td>{item.Month || 'N/A'}</td>
                            <td>{item.Year || 'N/A'}</td>
                            <td>{item.Income || 'N/A'}</td>
                            <td className='income-actions'>
                            <ExportPDFSingle income={item} serialNumber={item.serialNumber} />
                                <button className='income-eye-button' onClick={() => setViewIncome(item)}>👁️</button> {/* Eye button to view details */}
                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderCards = () => (
        <div className="income-card-list">
            {currentItems.map((item) => (
                <div key={item.serialNumber} className="income-card">
                    <div className="income-card-header">
                        <p><strong>S.No:</strong> {item.serialNumber}</p>
                    </div>
                    <p><strong>Month:</strong> {item.Month || 'N/A'}</p>
                    <p><strong>Year:</strong> {item.Year || 'N/A'}</p>
                    <p><strong>Income:</strong> {item.Income || 'N/A'}</p>
                    <div className="income-actions">
                    <ExportPDFSingle income={item} serialNumber={item.serialNumber} />
                        <button className='income-eye-button' onClick={() => setViewIncome(item)}>👁️</button> {/* Eye button to view details */}
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <Navbar />
            <h1 className='heading-income'>Income Details</h1>
           
            {isFormOpen && (
                <IncomeForm
                    onSubmit={handleAddIncome}
                    onCloseForm={() => setIsFormOpen(false)}
                />
            )}
            <div className='income-all-buttons'>
            <ExportPDFAll  incomes={currentItems} />
            <button onClick={() => setViewType(viewType === 'table' ? 'cards' : 'table')} className="income-switch-button"
                data-tooltip={viewType === 'table' ? 'Switch to Table View' : ' Switch to Cards View'}>
                 {/* {viewType === 'table' ? 'Cards' : 'Table'} */}
                 
                <FontAwesomeIcon icon={viewType === 'table' ? faThLarge : faThList} /> 
            </button>
            <button className='income-add-button' onClick={() => setIsFormOpen(true)}>Add Income</button>
            </div>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="income-search-input"
            />
           
            {viewType === 'table' ? renderCards() : renderTable()}
            <div className="income-count">
                Total incomes count: {filteredData.length}
              </div>
            <nav className="income-pagination-nav">
                <ul className="income-pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link page-link-1" onClick={prevPage}>Prev</button>
                    </li>
                    {[...Array(totalPages).keys()].map((number) => (
                        <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(number + 1)} className="page-link">
                                {number + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link page-link-2" onClick={nextPage}>Next</button>
                    </li>
                </ul>
            </nav>
            {viewIncome && (
                <div className="income-form-modal-overlay">
                    <div className="income-form-modal-container">
                        <button className="view-close-button" onClick={() => setViewIncome(null)}>Close</button>
                        <div>
                            <h2>Income Details</h2>
                            <p><strong>S.No:</strong> {viewIncome.serialNumber}</p>
                            <p><strong>Month:</strong> {viewIncome.Month || 'N/A'}</p>
                            <p><strong>Year:</strong> {viewIncome.Year || 'N/A'}</p>
                            <p><strong>Income:</strong> {viewIncome.Income || 'N/A'}</p>
                            {/* Add more fields as necessary */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomeDetails;
