import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
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
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // New state for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false); // New state for delete success modal

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/rooms');
            setRooms(response.data);
            fetchImageUrls(response.data);
        } catch (error) {
            setErrorMessage('Error fetching rooms. Please try again.');
            setIsErrorModalOpen(true);
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
        if (!newRoom.roomName || !newRoom.roomType || !newRoom.roomDescription || !newRoom.roomDetailsDescription ||
            newRoom.roomPricePerSlot < 0 || newRoom.roomPricePerDay < 0 || newRoom.roomPricePerWeek < 0) {
            setErrorMessage('Please fill all fields and ensure price values are not negative.');
            setIsErrorModalOpen(true);
            return;
        }

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

            setIsSuccessModalOpen(true);
            resetForm();
            fetchRooms();
            setIsModalOpen(false);
        } catch (error) {
            setErrorMessage('Error creating room. Please try again.');
            setIsErrorModalOpen(true);
            console.error('Error creating room:', error);
        }
    };

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

    // New function to open delete confirmation modal
    const openDeleteModal = (roomId) => {
        setRoomToDelete(roomId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteRoom = async () => {
        if (roomToDelete) {
            try {
                await axios.delete(`http://localhost:5000/rooms/${roomToDelete}`);
                fetchRooms();
                setIsDeleteModalOpen(false); // Close modal after deletion
                setRoomToDelete(null); // Reset roomToDelete
                setIsDeleteSuccessModalOpen(true); // Open delete success modal
            } catch (error) {
                setErrorMessage('Error deleting room. Please try again.');
                setIsErrorModalOpen(true);
                console.error('Error deleting room:', error);
            }
        }
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage('');
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    // Close delete confirmation modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setRoomToDelete(null); // Reset roomToDelete
    };

    // Close delete success modal
    const closeDeleteSuccessModal = () => {
        setIsDeleteSuccessModalOpen(false);
    };

    return (
        <div>


            {/* Thêm container cho bảng */}
            <div className={styles.tableContainer}>
                <h1 className={styles.headerTitle}>ROOM MANAGEMENT</h1>
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
                                        <Link to={`/rooms/${room.roomId}`}>
                                            <FaEdit color="black" size={30} />
                                        </Link>
                                        <FaTrash color="red" size={30} onClick={() => openDeleteModal(room.roomId)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.addRoomButton} onClick={() => setIsModalOpen(true)}>
                    <FaPlus size={30} color="white" />
                </div>
            </div>



            {/* Room Creation Modal */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeIcon} onClick={closeModal}>×</span>
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
                            placeholder="Price Per Slot"
                            value={newRoom.roomPricePerSlot}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                        <input
                            type="number"
                            name="roomPricePerDay"
                            placeholder="Price Per Day"
                            value={newRoom.roomPricePerDay}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                        <input
                            type="number"
                            name="roomPricePerWeek"
                            placeholder="Price Per Week"
                            value={newRoom.roomPricePerWeek}
                            onChange={handleInputChange}
                            className={styles.inputField}
                        />
                        <select name="roomStatus" value={newRoom.roomStatus} onChange={handleInputChange}>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                        <input type="file" onChange={handleImageChange} className={styles.fileInput} />
                        <button onClick={handleCreateRoom} className={styles.submitButton}>Create Room</button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {isSuccessModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Success!</h2>
                        <p>Room created successfully.</p>
                        <button onClick={closeSuccessModal}>Close</button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {isErrorModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Error!</h2>
                        <p>{errorMessage}</p>
                        <button onClick={closeErrorModal}>Close</button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Delete Room</h2>
                        <p>Are you sure you want to delete this room?</p>
                        <button onClick={handleDeleteRoom}>Yes</button>
                        <button onClick={closeDeleteModal}>No</button>
                    </div>
                </div>
            )}

            {/* Delete Success Modal */}
            {isDeleteSuccessModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Success!</h2>
                        <p>Room deleted successfully.</p>
                        <button onClick={closeDeleteSuccessModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageRooms;
