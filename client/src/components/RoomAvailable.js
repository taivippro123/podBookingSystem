import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function RoomAvailable() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/available-rooms')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch available rooms');
                }
                return response.json();
            })
            .then((data) => {
                setRooms(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Available Rooms</h2>
            {rooms.length === 0 ? (
                <p>No rooms available at the moment.</p>
            ) : (
                <ul>
                    {rooms.map((room) => (
                        <li key={room.roomId}>
                            <Link to={`/room-detail/${room.roomId}`}>
                                <h3>{room.roomName}</h3>
                            </Link>
                            <p>Type: {room.roomType}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default RoomAvailable;
