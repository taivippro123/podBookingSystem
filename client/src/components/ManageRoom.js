import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ManageRoom() {
    const { id } = useParams(); // Get room ID from URL parameters
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [room, setRoom] = useState(null);
    const [newRoomData, setNewRoomData] = useState({
        roomName: '',
        roomType: '',
        roomDescription: '',
        roomDetailsDescription: '',
        roomPricePerSlot: 0,
        roomPricePerDay: 0,
        roomPricePerWeek: 0,
        roomStatus: 'Available',
    });
    const [image, setImage] = useState(null); // State for image file
    const [error, setError] = useState(null); // To manage errors

    useEffect(() => {
        fetchRoomDetails();
    }, [id]);

    const fetchRoomDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/rooms/${id}`);
            setRoom(response.data);
            setNewRoomData({
                roomName: response.data.roomName,
                roomType: response.data.roomType,
                roomDescription: response.data.roomDescription,
                roomDetailsDescription: response.data.roomDetailsDescription,
                roomPricePerSlot: response.data.roomPricePerSlot,
                roomPricePerDay: response.data.roomPricePerDay,
                roomPricePerWeek: response.data.roomPricePerWeek,
                roomStatus: response.data.roomStatus,
            });
        } catch (error) {
            console.error('Error fetching room details:', error);
            setError('Failed to fetch room details.');
        }
    };

    const handleInputChange = (e) => {
        setNewRoomData({ ...newRoomData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Set image file to state
    };

    const handleUpdateRoom = async () => {
        try {
            const formData = new FormData();
            formData.append('roomName', newRoomData.roomName);
            formData.append('roomType', newRoomData.roomType);
            formData.append('roomDescription', newRoomData.roomDescription);
            formData.append('roomDetailsDescription', newRoomData.roomDetailsDescription);
            formData.append('roomPricePerSlot', newRoomData.roomPricePerSlot);
            formData.append('roomPricePerDay', newRoomData.roomPricePerDay);
            formData.append('roomPricePerWeek', newRoomData.roomPricePerWeek);
            formData.append('roomStatus', newRoomData.roomStatus);

            if (image) {
                formData.append('roomImage', image); // Append image file if available
            }

            await axios.put(`http://localhost:5000/rooms/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Room updated successfully');
            fetchRoomDetails(); // Refresh room details
        } catch (error) {
            console.error('Error updating room:', error);
            alert('Failed to update room.');
        }
    };

    const handleDeleteRoom = async () => {
        try {
            await axios.delete(`http://localhost:5000/rooms/${id}`);
            alert('Room deleted successfully');
            navigate('/manager'); // Redirect to the manager page after deletion
        } catch (error) {
            console.error('Error deleting room:', error);
            alert('Failed to delete room.');
        }
    };

    if (error) {
        return <p>{error}</p>; // Display error message if any
    }

    if (!room) {
        return <p>Loading room details...</p>; // Loading state
    }

    return (
        <div>
            <h2>Manage Room</h2>

            {/* Render multiple images */}
            {room.images && room.images.length > 0 ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                    {room.images.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Room ${room.roomId} image ${index + 1}`}
                            style={{ width: '150px', height: 'auto', objectFit: 'cover' }}
                        />
                    ))}
                </div>
            ) : (
                <p>No images available for this room.</p>
            )}

            <div><strong>Name:</strong> {room.roomName}</div>
            <div><strong>Type:</strong> {room.roomType}</div>
            <div><strong>Description:</strong> {room.roomDescription}</div>
            <div><strong>Details Description:</strong> {room.roomDetailsDescription}</div>
            <div><strong>Price per Slot:</strong> {room.roomPricePerSlot}</div>
            <div><strong>Price per Day:</strong> {room.roomPricePerDay}</div>
            <div><strong>Price per Week:</strong> {room.roomPricePerWeek}</div>
            <div><strong>Status:</strong> {room.roomStatus}</div>

            <h3>Update Room Information</h3>
            <input
                type="text"
                name="roomName"
                placeholder="Room Name"
                value={newRoomData.roomName}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="roomType"
                placeholder="Room Type"
                value={newRoomData.roomType}
                onChange={handleInputChange}
            />
            <textarea
                name="roomDescription"
                placeholder="Room Description"
                value={newRoomData.roomDescription}
                onChange={handleInputChange}
            ></textarea>
            <textarea
                name="roomDetailsDescription"
                placeholder="Room Details Description"
                value={newRoomData.roomDetailsDescription}
                onChange={handleInputChange}
            ></textarea>
            <input
                type="number"
                name="roomPricePerSlot"
                placeholder="Price per Slot"
                value={newRoomData.roomPricePerSlot}
                onChange={handleInputChange}
            />
            <input
                type="number"
                name="roomPricePerDay"
                placeholder="Price per Day"
                value={newRoomData.roomPricePerDay}
                onChange={handleInputChange}
            />
            <input
                type="number"
                name="roomPricePerWeek"
                placeholder="Price per Week"
                value={newRoomData.roomPricePerWeek}
                onChange={handleInputChange}
            />
            <select name="roomStatus" value={newRoomData.roomStatus} onChange={handleInputChange}>
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
            </select>

            {/* Image upload input */}
            <input type="file" onChange={handleImageChange} accept="image/*" />

            <button onClick={handleUpdateRoom}>Update Room</button>
            <button onClick={handleDeleteRoom}>Delete Room</button>
        </div>
    );
}

export default ManageRoom;
