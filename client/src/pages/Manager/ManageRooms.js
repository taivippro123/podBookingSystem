import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './ManageRooms.module.css';

function ManageRooms() {
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
    const [image, setImage] = useState(null);
    const [imageUrls, setImageUrls] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch rooms on component mount
    useEffect(() => {
        fetchRooms();
    }, []);

    // Fetch rooms from API
    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/rooms');
            setRooms(response.data);
            fetchImageUrls(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    // Fetch room images using Firebase storage
    const fetchImageUrls = async (rooms) => {
        const urls = {};
        const storage = getStorage();

        for (const room of rooms) {
            const imageUrl = room.images && room.images.length > 0 ? room.images[0] : null;
            if (imageUrl) {
                if (imageUrl.startsWith('https://')) {
                    urls[room.roomId] = imageUrl;
                } else {
                    try {
                        const downloadUrl = await getDownloadURL(ref(storage, imageUrl));
                        urls[room.roomId] = downloadUrl;
                    } catch (error) {
                        console.error('Error fetching image URL:', error);
                        urls[room.roomId] = null;
                    }
                }
            } else {
                urls[room.roomId] = null;
            }
        }

        setImageUrls(urls);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
    };

    // Handle image selection
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Handle room creation
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
                formData.append('roomImage', image);
            }

            // Send POST request to API to create room
            await axios.post('http://localhost:5000/rooms', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Room created successfully');
            resetForm();
            fetchRooms();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    // Reset form after submission
    const resetForm = () => {
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
    };

    // Handle room deletion
    const handleDeleteRoom = async (roomId) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await axios.delete(`http://localhost:5000/rooms/${roomId}`);
                fetchRooms(); // Refresh room list
            } catch (error) {
                console.error('Error deleting room:', error);
            }
        }
    };

    return (
        <div>
            <h2 className={styles.title}>Room Management</h2>

            <table className={styles.roomTable}>
                <thead>
                    <tr>
                        <th>Room Name</th>
                        <th>Room Status</th>
                        <th className={styles.actionsHeader}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.roomId}>
                            <td>{room.roomName}</td>
                            <td>{room.roomStatus}</td>
                            <td>
                                <div className={styles.actions}>
                                    <a href={imageUrls[room.roomId]} target="_blank" rel="noopener noreferrer">
                                        <FaEye color="blue" size={30} />
                                    </a>
                                    <Link to={`/rooms/${room.roomId}`}>
                                        <FaEdit color="black" size={30} />
                                    </Link>
                                    <FaTrash color="red" size={30} onClick={() => handleDeleteRoom(room.roomId)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Room Button */}
            <div className={styles.addRoomButton} onClick={() => setIsModalOpen(true)}>
                <FaPlus size={30} color="white" />
            </div>

            {/* Room Creation Modal */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeIcon} onClick={() => setIsModalOpen(false)}>×</span>
                        <h2>Add Room</h2>
                        <input
                            type="text"
                            name="roomName"
                            placeholder="Room Name"
                            value={newRoom.roomName}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                        <input
                            type="text"
                            name="roomType"
                            placeholder="Room Type"
                            value={newRoom.roomType}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                        <textarea
                            name="roomDescription"
                            placeholder="Room Description"
                            value={newRoom.roomDescription}
                            onChange={handleInputChange}
                            className={styles.textAreaField}
                        ></textarea>
                        <textarea
                            name="roomDetailsDescription"
                            placeholder="Room Details Description"
                            value={newRoom.roomDetailsDescription}
                            onChange={handleInputChange}
                            className={styles.textAreaField}
                        ></textarea>
                        <input
                            type="number"
                            name="roomPricePerSlot"
                            placeholder="Price per Slot"
                            value={newRoom.roomPricePerSlot}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                        <input
                            type="number"
                            name="roomPricePerDay"
                            placeholder="Price per Day"
                            value={newRoom.roomPricePerDay}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                        <input
                            type="number"
                            name="roomPricePerWeek"
                            placeholder="Price per Week"
                            value={newRoom.roomPricePerWeek}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                        <select
                            name="roomStatus"
                            value={newRoom.roomStatus}
                            onChange={handleInputChange}
                            className={styles.selectField}
                        >
                            <option value="Available">Available</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <input type="file" onChange={handleImageChange} accept="image/*" className={styles.fileInput} />
                        <button onClick={handleCreateRoom} className={styles.createButton}>Create Room</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageRooms;
