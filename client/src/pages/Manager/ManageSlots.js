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
        slotStartTime: '00:00:00',
        slotEndTime: '00:00:00',
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
            slotStartTime: slot.slotStartTime,
            slotEndTime: slot.slotEndTime,
            slotStatus: slot.slotStatus.charAt(0).toUpperCase() + slot.slotStatus.slice(1)
        });
        setIsEditMode(true);
        setHoveredSlotId(slot.slotId);
    };

    const handleAddSlot = async () => {
        const lastSlot = slots[slots.length - 1];

        if (lastSlot) {
            const lastEndTime = new Date(`1970-01-01T${lastSlot.slotEndTime}`);
            const newStartTime = new Date(`1970-01-01T${formData.slotStartTime}`);
            const thirtyMinutes = 30 * 60 * 1000;

            if (newStartTime < lastEndTime.getTime() + thirtyMinutes) {
                notification.error({ message: 'Error', description: `Start time must be at least 30 minutes after the end time of the last slot (${lastSlot.slotEndTime})!` });
                setIsPopupVisible(true);
                return;
            }
        }

        const isDuplicate = slots.some(slot => {
            const existingStart = new Date(`1970-01-01T${slot.slotStartTime}`);
            const existingEnd = new Date(`1970-01-01T${slot.slotEndTime}`);
            const newStart = new Date(`1970-01-01T${formData.slotStartTime}`);
            const newEnd = new Date(`1970-01-01T${formData.slotEndTime}`);
            const thirtyMinutes = 30 * 60 * 1000;

            return (
                (newStart >= existingStart && newStart < existingEnd + thirtyMinutes) ||
                (newEnd > existingStart - thirtyMinutes && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd + thirtyMinutes)
            );
        });

        if (isDuplicate) {
            notification.error({ message: 'Error', description: 'Slot already exists or overlaps with at least 30 minutes!' });
            
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/slots', {
                ...formData,
                slotStatus: formData.slotStatus.charAt(0).toUpperCase() + formData.slotStatus.slice(1)
            });
            setSlots([...slots, { ...formData, slotId: response.data.slotId }]);
            setIsAddingSlot(false);
            resetForm();
            notification.success({ message: 'Success', description: 'Add Slot Successfully!' });
        } catch (error) {
            notification.error({ message: 'Error', description: 'Error adding slot' });
            console.error('Error adding slot:', error);
        }
    };

    const handleUpdateSlot = async () => {
        if (!currentSlot) return;

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
            slotStartTime: '00:00:00',
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
                            <td>{slot.slotStartTime}</td>
                            <td>{slot.slotEndTime}</td>
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
                    <h2>Confirm Deletion</h2>
                    <p>Are you sure you want to delete this slot?</p>
                    <div className={styles.buttonContainer}>
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
