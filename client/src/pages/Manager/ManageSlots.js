import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './ManageSlots.module.css';
import { FaPlus } from 'react-icons/fa';
import { Modal, notification } from 'antd';

function ManageSlots() {
    const [slots, setSlots] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingSlot, setIsAddingSlot] = useState(false);
    const [currentSlot, setCurrentSlot] = useState(null);
    const [formData, setFormData] = useState({
        slotStartTime: '00:00',
        slotEndTime: '00:00',
        slotStatus: 'Available'
    });
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [slotToDelete, setSlotToDelete] = useState(null);
    
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [hoveredSlotId, setHoveredSlotId] = useState(null);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const response = await axios.get('http://localhost:5000/slots');
            setSlots(response.data);
        } catch (error) {
            notification.error({ message: 'Error', description: 'Error fetching slots' });
            
            console.error('Error fetching slots:', error);
        }
    };

    const handleEditClick = (slot) => {
        setCurrentSlot(slot);
        setFormData({
            slotStartTime: slot.slotStartTime.slice(0, 5), // Chỉ lấy hh:mm
            slotEndTime: slot.slotEndTime.slice(0, 5),     // Chỉ lấy hh:mm
            slotStatus: slot.slotStatus.charAt(0).toUpperCase() + slot.slotStatus.slice(1)
        });
        setIsEditMode(true);
        setHoveredSlotId(slot.slotId);
    };
    

    const handleAddSlot = async () => {
        const lastSlot = slots[slots.length - 1];
        const newStartTime = new Date(`1970-01-01T${formData.slotStartTime.slice(0, 5)}`);
        const newEndTime = new Date(`1970-01-01T${formData.slotEndTime.slice(0, 5)}`);
        const oneHourInMillis = 60 * 60 * 1000; // 1 giờ tính bằng mili giây
    
        // Kiểm tra nếu thời gian nhập vào là số âm hoặc vượt quá 24 giờ
        const startHours = parseInt(formData.slotStartTime.slice(0, 5).split(":")[0], 10);
        const endHours = parseInt(formData.slotEndTime.slice(0, 5).split(":")[0], 10);
        if (startHours < 0 || endHours < 0 || startHours > 24 || endHours > 24) {
            notification.error({ message: 'Error', description: 'Start time and end time must be between 00:00 and 24:00!' });
            setIsPopupVisible(true);
            return;
        }
    
        // // Kiểm tra nếu Start Time của slot mới cách End Time của slot cũ ít nhất 1 giờ
        // if (lastSlot) {
        //     const lastEndTime = new Date(`1970-01-01T${lastSlot.slotEndTime.slice(0, 5)}`);
        //     if (newStartTime < new Date(lastEndTime.getTime() + oneHourInMillis)) {
        //         notification.error({ message: 'Error', description: `Start time must be at least 1 hour after the end time of the last slot (${lastSlot.slotEndTime.slice(0, 5)})!` });
        //         setIsPopupVisible(true);
        //         return;
        //     }
        // }
    
        // Kiểm tra nếu End Time lớn hơn Start Time ít nhất 1 tiếng
        if (newEndTime <= newStartTime || (newEndTime - newStartTime) < oneHourInMillis) {
            notification.error({ message: 'Error', description: 'End time must be more than 1 hour after start time!' });
            setIsPopupVisible(true);
            return;
        }
    
        // Kiểm tra trùng lặp hoặc chồng chéo với các slot hiện tại
        const isDuplicate = slots.some(slot => {
            const existingStart = new Date(`1970-01-01T${slot.slotStartTime.slice(0, 5)}`);
            const existingEnd = new Date(`1970-01-01T${slot.slotEndTime.slice(0, 5)}`);
    
            return (
                (newStartTime >= existingStart && newStartTime < existingEnd) ||
                (newEndTime > existingStart && newEndTime <= existingEnd) ||
                (newStartTime <= existingStart && newEndTime >= existingEnd)
            );
        });
    
        if (isDuplicate) {
            notification.error({ message: 'Error', description: 'Slot already exists or overlaps with another slot!' });
            setIsPopupVisible(true);
            return;
        }
    
        // Thêm slot mới nếu không có lỗi
        try {
            const response = await axios.post('http://localhost:5000/slots', {
                ...formData,
                slotStatus: formData.slotStatus.charAt(0).toUpperCase() + formData.slotStatus.slice(1)
            });
            setSlots([...slots, { ...formData, slotId: response.data.slotId }]);
            setIsAddingSlot(false);
            resetForm();
            notification.success({ message: 'Success', description: 'Slot added successfully!' });
        } catch (error) {
            notification.error({ message: 'Error', description: 'Error adding slot' });
            console.error('Error adding slot:', error);
        }
    };
    
    

    const handleUpdateSlot = async () => {
        if (!currentSlot) return;
    
        const updatedStartTime = new Date(`1970-01-01T${formData.slotStartTime.slice(0, 5)}`);
        const updatedEndTime = new Date(`1970-01-01T${formData.slotEndTime.slice(0, 5)}`);
        const oneHourInMillis = 60 * 60 * 1000; // 1 giờ tính bằng mili giây
    
        // Kiểm tra nếu thời gian nhập vào là số âm hoặc vượt quá 24 giờ
        const startHours = parseInt(formData.slotStartTime.slice(0, 5).split(":")[0], 10);
        const endHours = parseInt(formData.slotEndTime.slice(0, 5).split(":")[0], 10);
        if (startHours < 0 || endHours < 0 || startHours >= 24 || endHours >= 24) {
            notification.error({ message: 'Error', description: 'Start time and end time must be between 00:00 and 24:00!' });
            return;
        }
    
        // Kiểm tra nếu End Time phải lớn hơn Start Time ít nhất 1 tiếng
        if (updatedEndTime <= updatedStartTime || (updatedEndTime - updatedStartTime) < oneHourInMillis) {
            notification.error({ message: 'Error', description: 'End time must be more than 1 hour after start time!' });
            return;
        }
    
        // Kiểm tra trùng lặp hoặc chồng chéo với các slot hiện tại (ngoại trừ slot hiện tại đang chỉnh sửa)
        const isDuplicate = slots.some(slot => {
            if (slot.slotId === currentSlot.slotId) return false;
    
            const existingStart = new Date(`1970-01-01T${slot.slotStartTime.slice(0, 5)}`);
            const existingEnd = new Date(`1970-01-01T${slot.slotEndTime.slice(0, 5)}`);
    
            return (
                (updatedStartTime >= existingStart && updatedStartTime < existingEnd) ||
                (updatedEndTime > existingStart && updatedEndTime <= existingEnd) ||
                (updatedStartTime <= existingStart && updatedEndTime >= existingEnd)
            );
        });
    
        if (isDuplicate) {
            notification.error({ message: 'Error', description: 'Slot already exists or overlaps with another slot!' });
            return;
        }
    
        // Cập nhật slot nếu không có lỗi
        try {
            await axios.put(`http://localhost:5000/slots/${currentSlot.slotId}`, {
                ...formData,
                slotStatus: formData.slotStatus.charAt(0).toUpperCase() + formData.slotStatus.slice(1)
            });
            setSlots(slots.map(slot =>
                slot.slotId === currentSlot.slotId ? { ...slot, ...formData } : slot
            ));
            setIsEditMode(false);
            resetForm();
            notification.success({ message: 'Success', description: 'Update Successfully' });
        } catch (error) {
            notification.error({ message: 'Error', description: 'Error updating slot' });
            console.error('Error updating slot:', error);
        }
    };
    
    
    


    const handleDeleteClick = (slotId) => {
        setSlotToDelete(slotId);
        setIsDeleteConfirmVisible(true);
        setHoveredSlotId(slotId);
    };


    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/slots/${slotToDelete}`);
            setSlots(slots.filter(slot => slot.slotId !== slotToDelete));
            setIsDeleteConfirmVisible(false);
            notification.success({ message: 'Success', description: 'Delete Successfully' });
        } catch (error) {
            notification.error({ message: 'Error', description: 'Error deleting slot' });
            console.error('Error deleting slot:', error);
        }
    };

    const cancelDelete = () => {
        setIsDeleteConfirmVisible(false);
        setSlotToDelete(null);
        setHoveredSlotId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            slotStartTime: '00:00',
            slotEndTime: '00:00:00',
            slotStatus: 'Available'
        });
        setCurrentSlot(null);
        setHoveredSlotId(null);
        setIsEditMode(false);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    return (
        <div className={styles.manageSlotsContainer}>
            <h1 className={styles.headerTitle}>MANAGE SLOTS</h1>
    
            <table className={styles.slotTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {slots.map(slot => (
                        <tr key={slot.slotId} className={hoveredSlotId === slot.slotId ? styles.hoveredRow : ''}>
                            <td>{slot.slotId}</td>
                            <td>{slot.slotStartTime.slice(0, 5)}</td> {/* Hiển thị chỉ hh:mm */}
                            <td>{slot.slotEndTime.slice(0, 5)}</td> {/* Hiển thị chỉ hh:mm */}
                            <td>{slot.slotStatus}</td>
                            <td className={styles.actionIcons}>
                                <FaEdit
                                    color="black"
                                    size={30}
                                    onClick={() => handleEditClick(slot)}
                                    className={styles.editIcon}
                                />
                                <FaTrash
                                    color="red"
                                    size={30}
                                    onClick={() => handleDeleteClick(slot.slotId)}
                                    className={styles.deleteIcon}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            {isAddingSlot && (
                <div className={styles.manageSlotsPopup}>
                    <div className={styles.manageSlotsPopupContent}>
                        <h2>Add New Slot</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddSlot(); }}>
                            <label>
                                Start Time:
                                <input
                                    type="text"
                                    name="slotStartTime"
                                    value={formData.slotStartTime}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter start time (e.g., 09:00)"
                                />
                            </label>
                            <label>
                                End Time:
                                <input
                                    type="text"
                                    name="slotEndTime"
                                    value={formData.slotEndTime}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter end time (e.g., 10:00)"
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    name="slotStatus"
                                    value={formData.slotStatus}
                                    onChange={handleInputChange}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Booked">Booked</option>
                                </select>
                            </label>
                            <button type="submit" className={styles.submitButton}>Add Slot</button>
                            <button type="button" onClick={() => setIsAddingSlot(false)} className={styles.closeButton}>Close</button>
                        </form>
                    </div>
                </div>
            )}
    
            {isEditMode && (
                <div className={styles.manageSlotsPopup}>
                    <div className={styles.manageSlotsPopupContent}>
                        <h2>Edit Slot</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateSlot(); }}>
                            <label>
                                Start Time:
                                <input
                                    type="text"
                                    name="slotStartTime"
                                    value={formData.slotStartTime}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter start time (e.g., 09:00)"
                                />
                            </label>
                            <label>
                                End Time:
                                <input
                                    type="text"
                                    name="slotEndTime"
                                    value={formData.slotEndTime}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter end time (e.g., 10:00)"
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    name="slotStatus"
                                    value={formData.slotStatus}
                                    onChange={handleInputChange}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Booked">Booked</option>
                                </select>
                            </label>
                            <button type="submit" className={styles.submitButton}>Update Slot</button>
                            <button type="button" onClick={resetForm} className={styles.closeButton}>Close</button>
                        </form>
                    </div>
                </div>
            )}
    
            {isDeleteConfirmVisible && (
                <div className={styles.deleteConfirmPopup}>
                    <div className={styles.modalContent}>
                        <h2>Are you sure you want to delete this slot?</h2>
                        <button onClick={confirmDelete} className={styles.confirmDeleteButton}>Yes</button>
                        <button onClick={cancelDelete} className={styles.cancelDeleteButton}>No</button>
                    </div>
                </div>
            )}
    
            <div className={styles.addSlotButton} onClick={() => setIsAddingSlot(true)}>
                <FaPlus size={30} color="white" />
            </div>
        </div>
    );
    
}

export default ManageSlots;
