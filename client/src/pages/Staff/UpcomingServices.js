import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UpcomingServices.module.css'; // Import CSS module
import { FaSearch } from 'react-icons/fa'; // Import biểu tượng kính lúp

const UpcomingServices = () => {
    const [upcomingServices, setUpcomingServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredServices, setFilteredServices] = useState([]);

    useEffect(() => {
        const fetchUpcomingServices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/staff/upcoming-services');
                setUpcomingServices(response.data);
                setFilteredServices(response.data); // Set dịch vụ gốc ban đầu
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Error fetching upcoming services');
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingServices();
    }, []);

    // Hàm tìm kiếm
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = upcomingServices.filter((service) => {
            return (
                service.bookingId.toString().includes(value) ||
                service.serviceId.toString().includes(value) ||
                service.serviceName.toLowerCase().includes(value.toLowerCase())
            );
        });
        setFilteredServices(filtered);
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.pageContainer}> {/* Container toàn trang */}
            <h2>Upcoming Services</h2>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch} // Gọi hàm tìm kiếm khi có sự thay đổi
                    placeholder="Search by Booking ID, Service ID, or Service Name"
                    className={styles.searchInput}
                />
            </div>
            {filteredServices.length === 0 ? (
                <p>No upcoming services found.</p>
            ) : (
                <table className={styles.servicesTable}>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Service ID</th>
                            <th>Service Name</th>
                            <th>Service Price</th>
                            <th>Service Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map((service) => (
                            <tr key={service.serviceId}>
                                <td>{service.bookingId}</td>
                                <td>{service.serviceId}</td>
                                <td>{service.serviceName}</td>
                                <td>{service.servicePrice} VND</td>
                                <td>{service.serviceDescription}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UpcomingServices;
