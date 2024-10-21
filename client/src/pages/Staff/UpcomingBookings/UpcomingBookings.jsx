import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpcomingBookings.css'; // Import CSS

const UpcomingBookings = () => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpcomingBookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/staff/upcoming-bookings');
                setUpcomingBookings(response.data);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Error fetching upcoming bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingBookings();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="bookings-container">
            <h2>Upcoming Bookings</h2>
            {upcomingBookings.length === 0 ? (
                <p>No upcoming bookings found.</p>
            ) : (
                <ul>
                    {upcomingBookings.map((booking) => (
                        <li key={booking.bookingId}>
                            Booking ID: {booking.bookingId}, Status: {booking.bookingStatus}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UpcomingBookings;
