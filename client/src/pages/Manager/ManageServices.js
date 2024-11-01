import React, { useEffect, useState } from 'react';
import styles from './ManageServices.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [serviceStatus, setServiceStatus] = useState('');
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [notification, setNotification] = useState('');
    const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const response = await fetch('http://localhost:5000/services');
        const data = await response.json();
        setServices(data);
    };

    const handleAddService = async () => {
        const newService = {
            serviceName,
            serviceDescription,
            servicePrice,
            serviceStatus,
        };

        const response = await fetch('http://localhost:5000/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newService),
        });

        if (response.ok) {
            fetchServices();
            showNotification('Service added successfully!');
            closePopup();
        } else {
            showNotification('Failed to add service.');
        }
    };

    const handleEditService = (service) => {
        setServiceName(service.serviceName);
        setServiceDescription(service.serviceDescription);
        setServicePrice(service.servicePrice);
        setServiceStatus(service.serviceStatus);
        setEditingServiceId(service.serviceId);
        setIsPopupOpen(true);
    };

    const handleUpdateService = async () => {
        const updatedService = {
            serviceName,
            serviceDescription,
            servicePrice,
            serviceStatus,
        };

        const response = await fetch(`http://localhost:5000/services/${editingServiceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedService),
        });

        if (response.ok) {
            fetchServices();
            showNotification('Service updated successfully!');
            closePopup();
        } else {
            showNotification('Failed to update service.');
        }
    };

    const confirmDeleteService = (serviceId) => {
        setServiceToDelete(serviceId);
        setIsDeleteConfirmationOpen(true);
    };

    const handleDeleteService = async () => {
        const response = await fetch(`http://localhost:5000/services/${serviceToDelete}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchServices();
            showNotification('Service deleted successfully!');
        } else {
            showNotification('Failed to delete service.');
        }
        setIsDeleteConfirmationOpen(false);
        setServiceToDelete(null);
    };

    const showNotification = (message) => {
        setNotification(message);
        setIsNotificationPopupOpen(true);
        setTimeout(() => {
            setIsNotificationPopupOpen(false);
            setNotification('');
        }, 3000);
    };

    const closePopup = () => {
        clearForm();
        setIsPopupOpen(false);
        setIsDeleteConfirmationOpen(false); // Đảm bảo đóng cửa sổ xác nhận xóa khi đóng pop-up
    };

    const clearForm = () => {
        setServiceName('');
        setServiceDescription('');
        setServicePrice('');
        setServiceStatus('');
        setEditingServiceId(null);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.headerTitle}>MANAGE SERVICES</h1>
            <div className={styles['manageservices-servicesList']}>

                <table className={styles['manageservices-table']}>
                    <thead>
                        <tr className={styles['manageservices-tr']}>
                            <th className={styles['manageservices-th']}>Service Name</th>
                            <th className={styles['manageservices-th']}>Description</th>
                            <th className={styles['manageservices-th']}>Price</th>
                            <th className={styles['manageservices-th']}>Status</th>
                            <th className={`${styles['manageservices-th']} ${styles['actions-th']}`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.serviceId} className={styles['manageservices-tr']}>
                                <td className={styles['manageservices-td']}>{service.serviceName}</td>
                                <td className={styles['manageservices-td']}>{service.serviceDescription}</td>
                                <td className={styles['manageservices-td']}>{service.servicePrice}</td>
                                <td className={styles['manageservices-td']}>{service.serviceStatus}</td>
                                <td className={`${styles['manageservices-td']} ${styles['actions-td']}`}>
                                    <div className={styles['actions-container']}>
                                        <button
                                            className={styles['manageservices-icon-button']}
                                            onClick={() => handleEditService(service)}
                                        >
                                            <FaEdit color="black" size={30} />
                                        </button>
                                        <button
                                            className={styles['manageservices-icon-button']}
                                            onClick={() => confirmDeleteService(service.serviceId)}
                                        >
                                            <FaTrash color="red" size={30} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className={styles['manageservices-add-service-button']} onClick={() => setIsPopupOpen(true)}>
                    <FaPlus size={30} color="white" />
                </button>
                {/* Kết thúc container cho bảng */}
            </div>

            {isPopupOpen && (
                <div className={styles['manageservices-popup-overlay']}>
                    <div className={styles['manageservices-popup-form']}>
                        <h1>{editingServiceId ? 'Edit Service' : 'Add Service'}</h1>
                        <input
                            type="text"
                            placeholder="Service Name"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                        />
                        <textarea
                            placeholder="Service Description"
                            value={serviceDescription}
                            onChange={(e) => setServiceDescription(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Service Price"
                            value={servicePrice}
                            onChange={(e) => setServicePrice(e.target.value)}
                        />
                        <select
                            value={serviceStatus}
                            onChange={(e) => setServiceStatus(e.target.value)}
                        >
                            <option value="">Select Status</option>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                        <button onClick={editingServiceId ? handleUpdateService : handleAddService}>
                            {editingServiceId ? 'Update Service' : 'Add Service'}
                        </button>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}

            {isDeleteConfirmationOpen && (
                <div className={styles['manageservices-popup-overlay2']}>
                    <div className={styles['confirmation-popup']}>
                        <p>Are you sure you want to delete this service?</p>
                        <button onClick={handleDeleteService}>Yes</button>
                        <button onClick={() => setIsDeleteConfirmationOpen(false)}>No</button>
                    </div>
                </div>
            )}



            {/* Popup thông báo */}
            {isNotificationPopupOpen && (
                <div className={styles['notification-popup']}>
                    <p>{notification}</p>
                </div>
            )}
        </div>
    );
};

export default ManageServices;
