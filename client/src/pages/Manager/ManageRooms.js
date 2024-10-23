import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import styles from './ManageRooms.module.css';
import { FaPlus } from 'react-icons/fa'; // Import biểu tượng dấu cộng từ react-icons

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
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái cho modal

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/rooms');
            setRooms(response.data);
            fetchImageUrls(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

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

    const handleInputChange = (e) => {
        setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
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
                formData.append('roomImage', image);
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
            fetchRooms();
            setIsModalOpen(false); // Đóng modal sau khi tạo phòng
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    return (
        <div className={styles.manageRoomsContainer}>
            <h2 className={styles.title}>Room Management</h2>

            <div className={styles.roomList}>
                {rooms.map((room) => (
                    <div key={room.roomId} className={styles.roomCard}>
                        {imageUrls[room.roomId] ? (
                            <img
                                src={imageUrls[room.roomId]}
                                alt={`Room ${room.roomId}`}
                                className={styles.roomImage}
                            />
                        ) : (
                            <p className={styles.noImageText}>No image available</p>
                        )}
                        <h4>{room.roomName}</h4>
                        <Link to={`/rooms/${room.roomId}`} className={styles.viewDetailsLink}>View Details</Link>
                    </div>
                ))}
            </div>

            {/* Biểu tượng dấu cộng */}
            <div className={styles.addRoomButton} onClick={() => setIsModalOpen(true)}>
                <FaPlus size={30} color="white" />
            </div>

            {/* Modal cho form tạo phòng */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeIcon} onClick={() => setIsModalOpen(false)}>×</span>
                        <h2 className={styles.modalTitle}>Create Room Form</h2>
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
                        <select name="roomStatus" value={newRoom.roomStatus} onChange={handleInputChange} className={styles.selectField}>
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
