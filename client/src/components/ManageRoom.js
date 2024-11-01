import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ManageRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
        setImage(e.target.files[0]);
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
                formData.append('roomImage', image);
            }

            await axios.put(`http://localhost:5000/rooms/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setIsSuccessModalOpen(true);
            fetchRoomDetails();
        } catch (error) {
            console.error('Error updating room:', error);
            alert('Failed to update room.');
        }
    };

    const handleDeleteRoom = async () => {
        try {
            await axios.delete(`http://localhost:5000/rooms/${id}`);
            alert('Room deleted successfully');
            navigate('/manager');
        } catch (error) {
            console.error('Error deleting room:', error);
            alert('Failed to delete room.');
        }
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const handleBackToHome = () => {
        navigate('/manager/manageRooms'); // Điều hướng đến trang quản lý
    };

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!room) {
        return <p>Loading room details...</p>;
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Manage Room</h2>

            {room.images && room.images.length > 0 ? (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                    {room.images.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Room ${room.roomId} image ${index + 1}`}
                            style={{ width: '150px', height: 'auto', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    ))}
                </div>
            ) : (
                <p>No images available for this room.</p>
            )}

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                <div><strong>Name:</strong> {room.roomName}</div>
                <div><strong>Type:</strong> {room.roomType}</div>
                <div><strong>Description:</strong> {room.roomDescription}</div>
                <div><strong>Details Description:</strong> {room.roomDetailsDescription}</div>
                <div><strong>Price per Slot:</strong> {room.roomPricePerSlot}</div>
                <div><strong>Price per Day:</strong> {room.roomPricePerDay}</div>
                <div><strong>Price per Week:</strong> {room.roomPricePerWeek}</div>
                <div><strong>Status:</strong> {room.roomStatus}</div>
            </div>

            <h3 style={{ marginTop: '20px' }}>Update Room Information</h3>
            <input
                type="text"
                name="roomName"
                placeholder="Room Name"
                value={newRoomData.roomName}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input
                type="text"
                name="roomType"
                placeholder="Room Type"
                value={newRoomData.roomType}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <textarea
                name="roomDescription"
                placeholder="Room Description"
                value={newRoomData.roomDescription}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <textarea
                name="roomDetailsDescription"
                placeholder="Room Details Description"
                value={newRoomData.roomDetailsDescription}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input
                type="number"
                name="roomPricePerSlot"
                placeholder="Price per Slot"
                value={newRoomData.roomPricePerSlot}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input
                type="number"
                name="roomPricePerDay"
                placeholder="Price per Day"
                value={newRoomData.roomPricePerDay}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input
                type="number"
                name="roomPricePerWeek"
                placeholder="Price per Week"
                value={newRoomData.roomPricePerWeek}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <select name="roomStatus" value={newRoomData.roomStatus} onChange={handleInputChange} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
            </select>

            <input type="file" onChange={handleImageChange} style={{ marginBottom: '15px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={handleUpdateRoom} style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '20px' }}>
                    Update Room
                </button>

                <button onClick={handleBackToHome} style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Back to Home Page
                </button>
            </div>

            {/* Cửa sổ pop-up thông báo thành công */}
            {isSuccessModalOpen && (
                <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                        <h3>Update Successful!</h3>
                        <p>Your room information has been updated successfully.</p>
                        <button onClick={closeSuccessModal} style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageRoom;
