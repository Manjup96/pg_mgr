import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../shared/Navbar";
import '../../styles/components/ExpenditureDetails.scss';
import ExpenditureForm from './ExpenditureForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faChevronLeft, faChevronRight, faThList, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { ExportPDFSingle, ExportPDFAll } from './ExpenditureExport';

const ExpenditureDetails = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [viewExpenditure, setViewExpenditure] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewType, setViewType] = useState('table');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const fetchData = async () => {
        try {
            const response = await axios.post('https://iiiqbets.com/pg-management/monthly-wise-total-expenditure-report-GET-API.php', {
                manager_email: 'ssy.balu@gmail.com',
                building_name: 'building 2'
            });
            const dataWithSerialNumbers = response.data.map((item, index) => ({
                ...item,
                serialNumber: index + 1
            }));
            setData(dataWithSerialNumbers);
            setFilteredData(dataWithSerialNumbers);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter(item =>
            (item.serialNumber && item.serialNumber.toString().includes(searchTerm)) ||
            (item.Month || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.Year || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.Expenditure || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, data]);

    const handleAddExpenditure = async (formData) => {
        try {
            await axios.post('https://iiiqbets.com/pg-management/Expenditure-POST-API.php', formData);
            alert('Expenditure added successfully!');
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to add expenditure.');
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
        <div className="expenditure-table-list">
            <table className="expenditure-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Expenditure</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.serialNumber}>
                            <td>{item.serialNumber}</td>
                            <td>{item.Month || 'N/A'}</td>
                            <td>{item.Year || 'N/A'}</td>
                            <td>{item.Expenditure || 'N/A'}</td>
                            <td className='expenditure-actions'>
                                <ExportPDFSingle expenditure={item} serialNumber={item.serialNumber} />
                                <button className='expenditure-eye-button' onClick={() => setViewExpenditure(item)}>👁️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderCards = () => (
        <div className="expenditure-card-container">
            {currentItems.map((item) => (
                <div key={item.serialNumber} className="expenditure-card">
                    <div className="expenditure-card-header">
                        <p><strong>S.No:</strong> {item.serialNumber}</p>
                    </div>
                    <p><strong>Month:</strong> {item.Month || 'N/A'}</p>
                    <p><strong>Year:</strong> {item.Year || 'N/A'}</p>
                    <p><strong>Expenditure:</strong> {item.Expenditure || 'N/A'}</p>
                    <div className="expenditure-actions">
                    <ExportPDFSingle expenditure={item} serialNumber={item.serialNumber} />
                        <button className='expenditure-eye-button' onClick={() => setViewExpenditure(item)}>👁️</button>
                        
                    </div>
                </div>
            ))}
        </div>
    );

   

    return (
        <div>
            <Navbar />
            <h1 className='heading-expenditure'>Expenditure Details</h1>
            <div className='expenditure-all-buttons'>
            <ExportPDFAll expenditures={currentItems} />
            <button onClick={() => setViewType(viewType === 'table' ? 'cards' : 'table')} className="expenditure-switch-button"
                 data-tooltip={viewType === 'table' ? 'Switch to Table View' : ' Switch to Cards View'}>
                {/* Switch to {viewType === 'table' ? 'Cards' : 'Table'} */}
               
                <FontAwesomeIcon icon={viewType === 'table' ? faThLarge : faThList} />
            </button>
            <button className='expenditure-add-button' onClick={() => setShowForm(true)}>Add Expenditure</button>
            </div>
            {showForm && (
                <ExpenditureForm
                    onSubmit={handleAddExpenditure}
                    onCloseForm={() => setShowForm(false)}
                />
            )}
           
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="expenditure-search-input"
            />
            
            {viewType === 'table' ? renderCards() : renderTable()}
            <div className="expenditure-count">
                Total Expenditures: {filteredData.length}
              </div>
            <nav className="expenditure-pagination-nav">
                <ul className="expenditure-pagination">
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
            {viewExpenditure && (
                <div className="expenditure-form-modal-overlay">
                    <div className="expenditure-form-modal-container">
                        <button className="view-close-button" onClick={() => setViewExpenditure(null)}>Close</button>
                        <div>
                            <h2>Expenditure Details</h2>
                            <p><strong>S.No:</strong> {viewExpenditure.serialNumber}</p>
                            <p><strong>Month:</strong> {viewExpenditure.Month || 'N/A'}</p>
                            <p><strong>Year:</strong> {viewExpenditure.Year || 'N/A'}</p>
                            <p><strong>Expenditure:</strong> {viewExpenditure.Expenditure || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenditureDetails;
