import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ViewBookings() {
    const navigate = useNavigate();

     useEffect(() => {
        // Remove long URL of payment
        navigate('/viewbookings', { replace: true });
    }, [navigate]);
    return (
        <div>View Bookings</div>
    )
}

export default ViewBookings