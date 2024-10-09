import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RoomAvailable() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/available-rooms');
            console.log("Rooms fetched:", response.data);
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    return (
        <div>
            <h2>Available Rooms</h2>
            <div className="room-list">
                {rooms.map((room) => (
                    <div key={room.roomId} className="room-card">
                        {/* Display all images */}
                        {/* {room.imageUrls && Array.isArray(room.imageUrls) ? (
                            room.imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`${room.roomName} image ${index + 1}`}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            ))
                        ) : (
                            <p>No images available</p>
                        )} */}

                        {/* Display only the first image */}
                        {room.imageUrls && room.imageUrls.length > 0 ? (
                            <img
                                src={room.imageUrls[0]}  // Display the first image
                                alt={`${room.roomName} image 1`}
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        ) : (
                            <p>No images available</p>
                        )}

                        <Link to={`/room-detail/${room.roomId}`}>
                            <h3>{room.roomName}</h3>
                        </Link>
                        <p>Type: {room.roomType}</p>
                        <p>Description: {room.roomDescription}</p>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoomAvailable;
