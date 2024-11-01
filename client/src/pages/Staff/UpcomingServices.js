import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UpcomingServices.module.css';
import Pagination from '../../components/Pagination/Pagination';

// Component to display the details of the selected service
const ServiceDetailsPopup = ({ service, onClose }) => {
    return (
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                <h3>Service Details</h3>
                <p><strong>Booking ID:</strong> {service.bookingId}</p>
                <p><strong>Service ID:</strong> {service.serviceId}</p>
                <p><strong>Service Name:</strong> {service.serviceName}</p>
                <p><strong>Service Price:</strong> {service.servicePrice} VND</p>
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
    const [serviceNameFilter, setServiceNameFilter] = useState('All Services');
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

    const indexOfLastService = currentPage * itemsPerPage;
    const indexOfFirstService = indexOfLastService - itemsPerPage;

    // Get unique service names for the dropdown
    const uniqueServiceNames = ['All Services', ...new Set(upcomingServices.map(service => service.serviceName))];

    // Filter services based on search term and selected service name
    const filteredServices = upcomingServices.filter(service => {
        const matchesSearchTerm = service.bookingId.toString().includes(searchTerm);
        const matchesServiceName = serviceNameFilter === 'All Services' || service.serviceName === serviceNameFilter;
        return matchesSearchTerm && matchesServiceName;
    });

    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (service) => {
        setSelectedService(service);
    };

    const handleClosePopup = () => {
        setSelectedService(null);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);

        // Update searchFailed state based on search results
        setSearchFailed(filteredServices.length === 0 && event.target.value !== '');
    };

    const handleServiceNameChange = (event) => {
        setServiceNameFilter(event.target.value);
        setCurrentPage(1);
        setSearchFailed(filteredServices.length === 0);
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.headerTitle}>UPCOMING SERVICES</h2>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by Booking ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select
                    className={styles.serviceNameDropdown}
                    value={serviceNameFilter}
                    onChange={handleServiceNameChange}
                >
                    {uniqueServiceNames.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>
            {searchFailed && <p className={styles.searchFailed}>Search failed</p>}
            {filteredServices.length === 0 ? (
                <p>No upcoming services found.</p>
            ) : (
                <>
                    <table className={styles.servicesTable}>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Service ID</th>
                                <th>Service Name</th>
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
                <ServiceDetailsPopup service={selectedService} onClose={handleClosePopup} />
            )}
        </div>
    );
};

export default UpcomingServices;
