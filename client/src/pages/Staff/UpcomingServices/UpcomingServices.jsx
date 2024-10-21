import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpcomingServices.css'; // Import CSS

const UpcomingServices = () => {
    const [upcomingServices, setUpcomingServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpcomingServices = async () => {
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

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="services-container">
            <h2>Upcoming Services</h2>
            {upcomingServices.length === 0 ? (
                <p>No services found for upcoming bookings.</p>
            ) : (
                <ul>
                    {upcomingServices.map((service) => (
                        <li key={service.serviceId}>
                            Service Name: {service.serviceName}, Price: ${service.servicePrice}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UpcomingServices;
