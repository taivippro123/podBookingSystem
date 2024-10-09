import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link for navigation
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

function Manager() {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({
        roomName: '',
        roomType: '',
        roomDescription: '',
        roomDetailsDescription: '',
        roomPricePerSlot: 0,
        roomPricePerDay: 0,
        roomPricePerWeek: 0,
        roomStatus: 'Available',
    });
    const [image, setImage] = useState(null);  // State for image file
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/rooms');
            setRooms(response.data);
            fetchImageUrls(response.data);  // Fetch corresponding image URLs
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchImageUrls = async (rooms) => {
        const urls = {};
        const storage = getStorage();  // Firebase storage instance

        for (const room of rooms) {
            const imageUrl = room.images && room.images.length > 0 ? room.images[0] : null; // Get the first image if available
            if (imageUrl) {
                if (imageUrl.startsWith('https://')) {
                    // If the imageUrl is already a full URL, use it directly
                    urls[room.roomId] = imageUrl;
                } else {
                    try {
                        // Fetch the download URL from Firebase if it's a storage path
                        const downloadUrl = await getDownloadURL(ref(storage, imageUrl));
                        urls[room.roomId] = downloadUrl;
                    } catch (error) {
                        console.error('Error fetching image URL:', error);
                        urls[room.roomId] = null;  // Set null if unable to fetch image
                    }
                }
            } else {
                urls[room.roomId] = null;  // No image available
            }
        }

        setImageUrls(urls);  // Update state with image URLs
    };


    const handleInputChange = (e) => {
        setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);  // Set image file to state
    };

    const handleCreateRoom = async () => {
        try {
            const formData = new FormData();
            formData.append('roomName', newRoom.roomName);
            formData.append('roomType', newRoom.roomType);
            formData.append('roomDescription', newRoom.roomDescription);
            formData.append('roomDetailsDescription', newRoom.roomDetailsDescription);
            formData.append('roomPricePerSlot', newRoom.roomPricePerSlot);
            formData.append('roomPricePerDay', newRoom.roomPricePerDay);
            formData.append('roomPricePerWeek', newRoom.roomPricePerWeek);
            formData.append('roomStatus', newRoom.roomStatus);

            if (image) {
                formData.append('roomImage', image);  // Append image file if available
            }

            await axios.post('http://localhost:5000/rooms', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Room created successfully');
            setNewRoom({
                roomName: '',
                roomType: '',
                roomDescription: '',
                roomDetailsDescription: '',
                roomPricePerSlot: 0,
                roomPricePerDay: 0,
                roomPricePerWeek: 0,
                roomStatus: 'Available',
            });
            setImage(null);
            fetchRooms();  // Refresh rooms list
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    return (
        <div>
            <h2>Room Management</h2>

            {/* Form for creating a room */}
            <div>
                <h3>Create Room</h3>
                <input
                    type="text"
                    name="roomName"
                    placeholder="Room Name"
                    value={newRoom.roomName}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="roomType"
                    placeholder="Room Type"
                    value={newRoom.roomType}
                    onChange={handleInputChange}
                />
                <textarea
                    name="roomDescription"
                    placeholder="Room Description"
                    value={newRoom.roomDescription}
                    onChange={handleInputChange}
                ></textarea>
                <textarea
                    name="roomDetailsDescription"
                    placeholder="Room Details Description"
                    value={newRoom.roomDetailsDescription}
                    onChange={handleInputChange}
                ></textarea>
                <input
                    type="number"
                    name="roomPricePerSlot"
                    placeholder="Price per Slot"
                    value={newRoom.roomPricePerSlot}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="roomPricePerDay"
                    placeholder="Price per Day"
                    value={newRoom.roomPricePerDay}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="roomPricePerWeek"
                    placeholder="Price per Week"
                    value={newRoom.roomPricePerWeek}
                    onChange={handleInputChange}
                />
                <select name="roomStatus" value={newRoom.roomStatus} onChange={handleInputChange}>
                    <option value="Available">Available</option>
                    <option value="Maintenance">Maintenance</option>
                </select>

                {/* Image upload input */}
                <input type="file" onChange={handleImageChange} accept="image/*" />

                <button onClick={handleCreateRoom}>Create Room</button>
            </div>

            <hr />

            {/* List of rooms with images and links */}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {rooms.map((room) => (
                    <div key={room.roomId} style={{ margin: '10px', width: '200px', textAlign: 'center' }}>
                        {imageUrls[room.roomId] ? (
                            <img
                                src={imageUrls[room.roomId]}
                                alt={`Room ${room.roomId}`}
                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                            />
                        ) : (
                            <p>No image available</p>
                        )}
                        <h4>{room.roomName}</h4>
                        <Link to={`/rooms/${room.roomId}`}>View Details</Link>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Manager;
