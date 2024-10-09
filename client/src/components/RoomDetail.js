import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function RoomDetail() {
    const { id } = useParams(); // Get roomId from the URL
    const [roomDetail, setRoomDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/room-details/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch room details');
                }
                return response.json();
            })
            .then((data) => {
                setRoomDetail(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    const handleBookNow = () => {
        navigate(`/booking/${id}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {/* Render the images */}
            {roomDetail.images && roomDetail.images.length > 0 ? (
                <div>
                    {roomDetail.images.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Room ${roomDetail.roomName} Image ${index + 1}`}
                            style={{ width: '300px', height: 'auto', marginRight: '10px', marginBottom: '10px' }}
                        />
                    ))}
                </div>
            ) : (
                <p>No images available for this room.</p>
            )}
            <h2>{roomDetail.roomName}</h2>
            <p>Type: {roomDetail.roomType}</p>
            <p>Description: {roomDetail.roomDetailsDescription}</p>
            <p>Price per Slot: {roomDetail.roomPricePerSlot} VND</p>
            <p>Price per Day: {roomDetail.roomPricePerDay} VND</p>
            <p>Price per Week: {roomDetail.roomPricePerWeek} VND</p>



            <button onClick={handleBookNow}>Book Now</button>
        </div>
    );
}

export default RoomDetail;
