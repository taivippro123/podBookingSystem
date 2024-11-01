import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UpcomingBookings.module.css';
import Pagination from '../../components/Pagination/Pagination'; // Đường dẫn tới component Pagination

const ITEMS_PER_PAGE = 5; // Số mục trên mỗi trang

const UpcomingBookings = () => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUpcomingBookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/staff/upcoming-bookings');
                setUpcomingBookings(response.data);
                setFilteredBookings(response.data);
                setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE)); // Tính tổng số trang
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Error fetching upcoming bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingBookings();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        let filtered = [];
        if (value.trim() === '') {
            filtered = upcomingBookings;
        } else {
            filtered = upcomingBookings.filter((booking) => {
                return (
                    booking.bookingId.toString().includes(value) || 
                    booking.roomId.toString().includes(value)
                );
            });
        }
        
        setFilteredBookings(filtered);
        setCurrentPage(1);
        setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    };

    const openPopup = (booking) => {
        setSelectedBooking(booking);
    };

    const closePopup = () => {
        setSelectedBooking(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

    return (
        
        <div className={styles.container}>
            {/* Thêm thẻ header ở đây, bên ngoài container chính */}
            <h1 className={styles.headerTitle}>UPCOMING BOOKINGS</h1>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by Booking ID or Room ID"
                    className={styles.searchInput}
                />
            </div>
            {filteredBookings.length === 0 ? (
                <p>No upcoming bookings found.</p>
            ) : (
                <>
                    <table className={styles.bookingsTable}>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Room ID</th>
                                <th>Start Day</th>
                                <th>End Day</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((booking) => (
                                <tr key={booking.bookingId}>
                                    <td>{booking.bookingId}</td>
                                    <td>{booking.roomId}</td>
                                    <td>{new Date(booking.bookingStartDay).toLocaleDateString()}</td>
                                    <td>{new Date(booking.bookingEndDay).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => openPopup(booking)} className={styles.viewButton}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Sử dụng component Pagination */}
                    <Pagination
                        totalItems={filteredBookings.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
            
            {/* Popup chi tiết */}
            {selectedBooking && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <h3>Booking Details</h3>
                        <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
                        <p><strong>User ID:</strong> {selectedBooking.userId}</p>
                        <p><strong>Room ID:</strong> {selectedBooking.roomId}</p>
                        <p><strong>Start Day:</strong> {new Date(selectedBooking.bookingStartDay).toLocaleDateString()}</p>
                        <p><strong>End Day:</strong> {new Date(selectedBooking.bookingEndDay).toLocaleDateString()}</p>
                        <p><strong>Total Price:</strong> {selectedBooking.totalPrice} VND</p>
                        <p><strong>Status:</strong> {selectedBooking.bookingStatus}</p>
                        <p><strong>Created At:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                        <button onClick={closePopup} className={styles.closeButton}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingBookings;
