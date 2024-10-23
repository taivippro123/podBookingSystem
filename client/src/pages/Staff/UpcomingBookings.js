import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UpcomingBookings.module.css'; // Import CSS module

const UpcomingBookings = () => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]);

    useEffect(() => {
        const fetchUpcomingBookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/staff/upcoming-bookings');
                setUpcomingBookings(response.data);
                setFilteredBookings(response.data); // Set dữ liệu bookings gốc ban đầu
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Error fetching upcoming bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingBookings();
    }, []);

    // Hàm tìm kiếm
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = upcomingBookings.filter((booking) => {
            return (
                booking.bookingId.toString().includes(value) || // Chuyển thành chuỗi
                booking.userId.toString().includes(value) || // Chuyển thành chuỗi
                booking.roomId.toString().includes(value) // Chuyển thành chuỗi
            );
        });
        setFilteredBookings(filtered);
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div>
            <h2>Upcoming Bookings</h2>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by Booking ID, User ID, or Room ID"
                    className={styles.searchInput}
                />
            </div>
            {filteredBookings.length === 0 ? (
                <p>No upcoming bookings found.</p>
            ) : (
                <table className={styles.bookingsTable}>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>User ID</th>
                            <th>Room ID</th>
                            <th>Start Day</th>
                            <th>End Day</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking) => (
                            <tr key={booking.bookingId}>
                                <td>{booking.bookingId}</td>
                                <td>{booking.userId}</td>
                                <td>{booking.roomId}</td>
                                <td>{new Date(booking.bookingStartDay).toLocaleDateString()}</td>
                                <td>{new Date(booking.bookingEndDay).toLocaleDateString()}</td>
                                <td>{booking.totalPrice} VND</td>
                                <td>{booking.bookingStatus}</td>
                                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
    
};

export default UpcomingBookings;
