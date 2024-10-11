import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string'; // For parsing query params

function ViewBookings() {
    const [historyBookings, setHistoryBookings] = useState([]);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get userId from localStorage or URL
    const userId = localStorage.getItem('userId'); // Assuming it's stored as 'userId' in localStorage

    useEffect(() => {
        // Extract query parameters from URL
        const parsedQuery = queryString.parse(window.location.search);
        const { userId: queryUserId } = parsedQuery;

        // If userId is in query params, save it to localStorage and clean the URL
        if (queryUserId) {
            localStorage.setItem('userId', queryUserId);
            navigate(`/viewbookings/${queryUserId}`, { replace: true }); // Clean URL by removing query params
            return; // Prevent further execution of the effect
        }

        const storedUserId = localStorage.getItem('userId'); // Fetch updated userId from localStorage

        // If no userId in storage or query, show error
        if (!storedUserId) {
            console.error("User ID is missing.");
            alert("User ID is missing.");
            return;
        }

        // Fetch bookings from the server
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/viewbookings/${storedUserId}`);
                const { history, upcoming } = response.data;

                setHistoryBookings(history);
                setUpcomingBookings(upcoming);
            } catch (error) {
                console.error("Error fetching view bookings:", error);
                alert(`Failed to fetch bookings: ${error.message}`);
                setError("Failed to fetch bookings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const renderSlots = (slots) => {
        return (
            <ul>
                {slots.map((slot, index) => (
                    <li key={index}>
                        {new Date(`1970-01-01T${slot.slotStartTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(`1970-01-01T${slot.slotEndTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </li>
                ))}
            </ul>
        );
    };

    const renderServices = (services) => {
        if (services.length === 0) {
            return <p>No services</p>;
        }
        return (
            <ul>
                {services.map((service, index) => (
                    <li key={index}>
                        {service.serviceName}, Price: {service.servicePrice} VND
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <h1>View Bookings</h1>

            <h2>Upcoming Bookings</h2>
            {upcomingBookings.length > 0 ? (
                <ul>
                    {upcomingBookings.map((booking) => (
                        <li key={booking.bookingId}>
                            Room: {booking.roomName}, Status: {booking.bookingStatus}, 
                            Start: {new Date(booking.bookingStartDay).toLocaleDateString()}, 
                            End: {new Date(booking.bookingEndDay).toLocaleDateString()}
                            <br />
                            <strong>Slots:</strong>
                            {renderSlots(booking.slots)}
                            <strong>Services:</strong>
                            {renderServices(booking.services)}
                            <p><strong>Total Price: </strong> {booking.totalPrice} VND</p> {/* Display total price */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming bookings.</p>
            )}

            <h2>Booking History</h2>
            {historyBookings.length > 0 ? (
                <ul>
                    {historyBookings.map((booking) => (
                        <li key={booking.bookingId}>
                            Room: {booking.roomName}, Status: {booking.bookingStatus}, 
                            Start: {new Date(booking.bookingStartDay).toLocaleDateString()}, 
                            End: {new Date(booking.bookingEndDay).toLocaleDateString()}
                            <br />
                            <strong>Slots:</strong>
                            {renderSlots(booking.slots)}
                            <strong>Services:</strong>
                            {renderServices(booking.services)}
                            <p><strong>Total Price: </strong> {booking.totalPrice} VND</p> {/* Display total price */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No booking history available.</p>
            )}
        </div>
    );
}

export default ViewBookings;
