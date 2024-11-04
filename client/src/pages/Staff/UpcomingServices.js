import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UpcomingServices.module.css';
import Pagination from '../../components/Pagination/Pagination';

const ServiceDetailsPopup = ({ service, onClose, formatCurrency }) => {
    return (
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                <h3>Service Details</h3>
                <p><strong>Booking ID:</strong> {service.bookingId}</p>
                <p><strong>Service ID:</strong> {service.serviceId}</p>
                <p><strong>Service Name:</strong> {service.serviceName}</p>
                <p><strong>Service Price:</strong> {formatCurrency(service.servicePrice)}</p>
                <p><strong>Service Description:</strong> {service.serviceDescription}</p>
                <button className={styles.closeButton} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

const UpcomingServices = () => {
    const [upcomingServices, setUpcomingServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFailed, setSearchFailed] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUpcomingServices = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/staff/upcoming-services');
                setUpcomingServices(response.data);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Error fetching upcoming services');
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingServices();
    }, []);

    const formatCurrency = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };

    const sortedServices = [...upcomingServices].sort((a, b) => {
        if (sortConfig.key) {
            const isAscending = sortConfig.direction === 'asc';
            const aValue = a[sortConfig.key] ? a[sortConfig.key].toString() : ''; // Convert to string for comparison
            const bValue = b[sortConfig.key] ? b[sortConfig.key].toString() : '';
            if (aValue < bValue) return isAscending ? -1 : 1;
            if (aValue > bValue) return isAscending ? 1 : -1;
        }
        return 0;
    });

    const filteredServices = sortedServices.filter(service => {
        return service.bookingId.toString().includes(searchTerm) ||
            service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const currentServices = filteredServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => setCurrentPage(page);

    const handleViewDetails = (service) => setSelectedService(service);

    const handleClosePopup = () => setSelectedService(null);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
        setSearchFailed(filteredServices.length === 0 && event.target.value !== '');
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.errorMessage}>{error}</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.headerTitle}>UPCOMING SERVICES</h2>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by Booking ID or Service Name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            {searchFailed && <p className={styles.searchFailed}>Search failed</p>}
            {filteredServices.length === 0 ? (
                <p>No upcoming services found.</p>
            ) : (
                <>
                    <table className={styles.servicesTable}>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('bookingId')}>
                                    Booking ID {sortConfig.key === 'bookingId' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </th>
                                <th onClick={() => handleSort('serviceId')}>
                                    Service ID {sortConfig.key === 'serviceId' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </th>
                                <th onClick={() => handleSort('serviceName')}>
                                    Service Name {sortConfig.key === 'serviceName' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentServices.map((service, index) => (
                                <tr key={`${service.serviceId}-${index}`}>
                                    <td>{service.bookingId}</td>
                                    <td>{service.serviceId}</td>
                                    <td>{service.serviceName}</td>
                                    <td>
                                        <button
                                            className={styles.viewButton}
                                            onClick={() => handleViewDetails(service)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        totalItems={filteredServices.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
            {selectedService && (
                <ServiceDetailsPopup service={selectedService} onClose={handleClosePopup} formatCurrency={formatCurrency} />
            )}
        </div>
    );
};

export default UpcomingServices;
