import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UpcomingServices.module.css'; // Import CSS module
import Pagination from '../../components/Pagination/Pagination';

const UpcomingServices = () => {
    const [upcomingServices, setUpcomingServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Trạng thái cho trang hiện tại
    const itemsPerPage = 8; // Số lượng dịch vụ hiển thị trên mỗi trang

    useEffect(() => {
        const fetchUpcomingServices = async () => {
            setLoading(true); // Reset loading khi fetch
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

    // Tính toán các dịch vụ cần hiển thị trên trang hiện tại
    const indexOfLastService = currentPage * itemsPerPage;
    const indexOfFirstService = indexOfLastService - itemsPerPage;
    const currentServices = upcomingServices.slice(indexOfFirstService, indexOfLastService);

    const handlePageChange = (page) => {
        setCurrentPage(page); // Cập nhật trang hiện tại
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
            {upcomingServices.length === 0 ? (
                <p>No upcoming services found.</p>
            ) : (
                <>
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
                            {currentServices.map((service, index) => (
                                <tr key={`${service.serviceId}-${index}`}> {/* Tạo key duy nhất */}
                                    <td>{service.bookingId}</td>
                                    <td>{service.serviceId}</td>
                                    <td>{service.serviceName}</td>
                                    <td>{service.servicePrice} VND</td>
                                    <td>{service.serviceDescription}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        totalItems={upcomingServices.length} // Tổng số dịch vụ
                        itemsPerPage={itemsPerPage} // Số lượng dịch vụ mỗi trang
                        currentPage={currentPage} // Trang hiện tại
                        onPageChange={handlePageChange} // Hàm xử lý thay đổi trang
                    />
                </>
            )}
        </div>
    );
};

export default UpcomingServices;
