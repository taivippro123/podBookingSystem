import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { notification } from 'antd'; // Import notification from antd
import styles from './ManageRooms.module.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

function ManageRooms() {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({
        roomName: '',
        roomType: '',
        roomDescription: '',
        roomDetailsDescription: '',
        roomPricePerSlot: '',
        roomPricePerDay: '',
        roomPricePerWeek: '',
        roomStatus: 'Available',
    });
    const [image, setImage] = useState([]);
    const [tempImageUrl, setTempImageUrl] = useState('');
    const [imageUrls, setImageUrls] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState({
        roomId: '',
        roomName: '',
        roomType: '',
        roomDescription: '',
        roomDetailsDescription: '',
        roomPricePerSlot: 0,
        roomPricePerDay: 0,
        roomPricePerWeek: 0,
        roomStatus: 'Available',
        images: [],
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/rooms');
            setRooms(response.data);
            fetchImageUrls(response.data);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error fetching rooms. Please try again.',
            });
        }
    };

    const formatPrice = (price) => {
        if (!price) return '0 VND';
        return `${(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
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
        const { name, value } = e.target;
        setNewRoom((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setImage(selectedFile);

        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setTempImageUrl(url);
        }
    };

    const handleCreateRoom = async () => {
        if (!newRoom.roomName || !newRoom.roomType || !newRoom.roomDescription || !newRoom.roomDetailsDescription ||
            newRoom.roomPricePerSlot < 0 || newRoom.roomPricePerDay < 0 || newRoom.roomPricePerWeek < 0) {
            notification.error({
                message: 'Error',
                description: 'Please fill all fields and ensure price values are not negative.',
            });
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

            notification.success({
                message: 'Success',
                description: 'Room created successfully.',
            });
            resetForm();
            fetchRooms();
            setIsModalOpen(false);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error creating room. Please try again.',
            });
            console.error('Error creating room:', error);
        }
        setTempImageUrl('');
        setImage(null);
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

    const handleEditRoom = async () => {
        if (!roomToEdit.roomName || !roomToEdit.roomType || !roomToEdit.roomDescription || !roomToEdit.roomDetailsDescription ||
            roomToEdit.roomPricePerSlot < 0 || roomToEdit.roomPricePerDay < 0 || roomToEdit.roomPricePerWeek < 0) {
            notification.error({
                message: 'Error',
                description: 'Please fill all fields and ensure price values are not negative.',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('roomName', roomToEdit.roomName);
            formData.append('roomType', roomToEdit.roomType);
            formData.append('roomDescription', roomToEdit.roomDescription);
            formData.append('roomDetailsDescription', roomToEdit.roomDetailsDescription);
            formData.append('roomPricePerSlot', roomToEdit.roomPricePerSlot);
            formData.append('roomPricePerDay', roomToEdit.roomPricePerDay);
            formData.append('roomPricePerWeek', roomToEdit.roomPricePerWeek);
            formData.append('roomStatus', roomToEdit.roomStatus);

            roomToEdit.images.forEach((img) => {
                formData.append('roomImages', img);
            });

            if (image) {
                formData.append('roomImage', image);
            }

            await axios.put(`http://localhost:5000/rooms/${roomToEdit.roomId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            notification.success({
                message: 'Success',
                description: 'Room updated successfully.',
            });
            fetchRooms();
            closeEditModal();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Error updating room. Please try again.',
            });
            console.error('Error updating room:', error);
        }
        setTempImageUrl(null);
    };

    const openEditModal = (room) => {
        setRoomToEdit(room);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setRoomToEdit(null);
        setImage(null);
    };

    const openDeleteModal = (roomId) => {
        setRoomToDelete(roomId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteRoom = async () => {
        if (roomToDelete) {
            try {
                await axios.delete(`http://localhost:5000/rooms/${roomToDelete}`);
                fetchRooms();
                setIsDeleteModalOpen(false);
                setRoomToDelete(null);
                notification.success({
                    message: 'Success',
                    description: 'Room deleted successfully.',
                });
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: 'Error deleting room. Please try again.',
                });
                console.error('Error deleting room:', error);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setRoomToDelete(null);
    };



    return (
        <div>
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
                                        <FaEdit color="black" size={30} onClick={() => openEditModal(room)} />
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
            {/* Room Creation Modal */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeIcon} onClick={closeModal}>×</span>
                        <h2>Add Room</h2>

                        {/* Các trường nhập liệu khác */}
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

                        {/* Các trường giá tiền với định dạng */}
                        <div className={styles.priceContainer}>
                            <input
                                type="number"
                                name="roomPricePerSlot"
                                placeholder="Price Per Slot"
                                value={newRoom.roomPricePerSlot}
                                onChange={handleInputChange}
                                className={styles.inputField}
                            />
                            <span>{formatPrice(newRoom.roomPricePerSlot)}</span>
                        </div>
                        <div className={styles.priceContainer}>
                            <input
                                type="number"
                                name="roomPricePerDay"
                                placeholder="Price Per Day"
                                value={newRoom.roomPricePerDay}
                                onChange={handleInputChange}
                                className={styles.inputField}
                            />
                            <span>{formatPrice(newRoom.roomPricePerDay)}</span>
                        </div>
                        <div className={styles.priceContainer}>
                            <input
                                type="number"
                                name="roomPricePerWeek"
                                placeholder="Price Per Week"
                                value={newRoom.roomPricePerWeek}
                                onChange={handleInputChange}
                                className={styles.inputField}
                            />
                            <span>{formatPrice(newRoom.roomPricePerWeek)}</span>
                        </div>

                        {/* Chọn trạng thái phòng */}
                        <select
                            name="roomStatus"
                            value={newRoom.roomStatus}
                            onChange={handleInputChange}
                            className={styles.selectField}
                        >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>

                        {/* Khu vực chọn ảnh với biểu tượng PlusOutlined */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100px',
                                height: '100px',
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: '#999',
                                marginBottom: '20px'
                            }}
                            onClick={() => document.getElementById('imageUpload').click()} // Mở cửa sổ chọn tệp
                        >
                            <Button type="dashed" icon={<PlusOutlined />} style={{ width: '100%', height: '100%' }}>

                            </Button>
                        </div>
                        <input
                            type="file"
                            id="imageUpload"
                            onChange={handleImageChange}
                            style={{ display: 'none' }} // Ẩn input file
                        />

                        {/* Hiển thị ảnh tạm thời */}
                        {tempImageUrl && (
                            <div>
                                <img src={tempImageUrl} alt="Temporary" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '20px' }} />
                            </div>
                        )}

                        
                        <button onClick={handleCreateRoom} className={styles.submitButton}>Create Room</button>
                    </div>
                </div>
            )}



            {isEditModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeIcon} onClick={closeEditModal}>×</span>
                        <h1>Edit Room</h1>

                        {/* Phần chọn ảnh */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            {/* Hiển thị các ảnh hiện tại */}
                            {roomToEdit.images && roomToEdit.images.length > 0 && (
                                <>
                                    {roomToEdit.images.map((imageUrl, index) => (
                                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px' }}>
                                            <img
                                                src={imageUrl}
                                                alt={`Room ${index + 1}`}
                                                style={{ width: '100px', height: '100px', borderRadius: '8px' }}
                                            />
                                            <button
                                                type="button"
                                                
                                                style={{
                                                    marginTop: '5px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <FaTrash color="red" size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Ô box có dấu cộng để thêm ảnh mới */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100px',
                                    height: '100px',
                                    border: '2px dashed #ccc',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: '#999',
                                    marginBottom: '20px'
                                }}
                                onClick={() => document.getElementById('imageUpload').click()} // Mở cửa sổ chọn tệp
                            >
                                <Button type="dashed" icon={<PlusOutlined />} style={{ width: '100%', height: '100%' }}>

                                </Button>
                            </div>
                            <input
                                type="file"
                                id="imageUpload"
                                onChange={handleImageChange}
                                style={{ display: 'none' }} // Ẩn input file
                            />
                        </div>

                        {/* Các trường nhập khác */}
                        <input
                            type="text"
                            name="roomName"
                            placeholder="Room Name"
                            value={roomToEdit?.roomName}
                            onChange={(e) => setRoomToEdit({ ...roomToEdit, roomName: e.target.value })}
                            className={styles.inputField}
                        />
                        <input
                            type="text"
                            name="roomType"
                            placeholder="Room Type"
                            value={roomToEdit?.roomType}
                            onChange={(e) => setRoomToEdit({ ...roomToEdit, roomType: e.target.value })}
                            className={styles.inputField}
                        />
                        <textarea
                            name="roomDescription"
                            placeholder="Room Description"
                            value={roomToEdit?.roomDescription}
                            onChange={(e) => setRoomToEdit({ ...roomToEdit, roomDescription: e.target.value })}
                            className={styles.textAreaField}
                        ></textarea>
                        <textarea
                            name="roomDetailsDescription"
                            placeholder="Room Details Description"
                            value={roomToEdit?.roomDetailsDescription}
                            onChange={(e) => setRoomToEdit({ ...roomToEdit, roomDetailsDescription: e.target.value })}
                            className={styles.textAreaField}
                        ></textarea>

                        {/* Hiển thị giá tiền đã được định dạng */}
                        <div className={styles.priceContainer}>
                            <input
                                type="number"
                                name="roomPricePerSlot"
                                placeholder="Price Per Slot"
                                value={roomToEdit?.roomPricePerSlot}
                                onChange={(e) => setRoomToEdit({ ...roomToEdit, roomPricePerSlot: e.target.value })}
                                className={styles.inputField}
                            />
                            <span>{formatPrice(roomToEdit?.roomPricePerSlot)}</span>
                        </div>
                        <div className={styles.priceContainer}>
                            <input
                                type="number"
                                name="roomPricePerDay"
                                placeholder="Price Per Day"
                                value={roomToEdit?.roomPricePerDay}
                                onChange={(e) => setRoomToEdit({ ...roomToEdit, roomPricePerDay: e.target.value })}
                                className={styles.inputField}
                            />
                            <span>{formatPrice(roomToEdit?.roomPricePerDay)}</span>
                        </div>
                        <div className={styles.priceContainer}>
                            <input
                                type="number"
                                name="roomPricePerWeek"
                                placeholder="Price Per Week"
                                value={roomToEdit?.roomPricePerWeek}
                                onChange={(e) => setRoomToEdit({ ...roomToEdit, roomPricePerWeek: e.target.value })}
                                className={styles.inputField}
                            />
                            <span>{formatPrice(roomToEdit?.roomPricePerWeek)}</span>
                        </div>

                        <select
                            name="roomStatus"
                            value={roomToEdit?.roomStatus}
                            onChange={(e) => setRoomToEdit({ ...roomToEdit, roomStatus: e.target.value })}
                            className={styles.selectField}
                        >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                        <button onClick={handleEditRoom} className={styles.submitButton}>Update Room</button>
                    </div>
                </div>
            )}


            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Are you sure you want to delete this room?</h2>
                        <button onClick={handleDeleteRoom} className={styles.confirmDeleteButton}>Yes</button>
                        <button onClick={closeDeleteModal} className={styles.cancelDeleteButton}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageRooms;
