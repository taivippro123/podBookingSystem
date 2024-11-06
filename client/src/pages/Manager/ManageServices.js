import React, { useEffect, useState } from 'react';
import styles from './ManageServices.module.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Modal, notification } from 'antd';

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [serviceStatus, setServiceStatus] = useState('');
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
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
            servicePrice: parseFloat(servicePrice.replace(/\./g, '').replace(',', '.')),
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
            showNotification('Service added successfully!', 'success');
            closePopup();
        } else {
            showNotification('Failed to add service.', 'error');
        }
    };

    const handleEditService = (service) => {
        setServiceName(service.serviceName);
        setServiceDescription(service.serviceDescription);
        setServicePrice(formatInputPrice(service.servicePrice));
        setServiceStatus(service.serviceStatus);
        setEditingServiceId(service.serviceId);
        setIsPopupOpen(true);
    };

    const handleUpdateService = async () => {
        const updatedService = {
            serviceName,
            serviceDescription,
            servicePrice: parseFloat(servicePrice.replace(/\./g, '').replace(',', '.')),
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
            showNotification('Service updated successfully!', 'success');
            closePopup();
        } else {
            showNotification('Failed to update service.', 'error');
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
            showNotification('Service deleted successfully!', 'success');
        } else {
            showNotification('Failed to delete service.', 'error');
        }
        setIsDeleteConfirmationOpen(false);
        setServiceToDelete(null);
    };

    const showNotification = (message, type) => {
        notification[type]({
            message: message,
            duration: 3,
        });
    };

    const closePopup = () => {
        clearForm();
        setIsPopupOpen(false);
        setIsDeleteConfirmationOpen(false);
    };

    const clearForm = () => {
        setServiceName('');
        setServiceDescription('');
        setServicePrice('');
        setServiceStatus('');
        setEditingServiceId(null);
    };

    // Hàm định dạng giá tiền
    const formatPrice = (amount) => {
        if (!amount) return "0 VND";
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };

    const formatInputPrice = (value) => {
        const numericValue = value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };

    const handleServicePriceChange = (e) => {
        let value = e.target.value.replace(/[^\d]/g, ''); // Chỉ lấy phần số
        if (value === "") {
            setServicePrice(""); // Xóa tất cả nếu không có giá trị số
        } else {
            // Định dạng giá trị thành nhóm 3 chữ số mà không thêm "VND" vào cuối
            const formattedPrice = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            setServicePrice(formattedPrice); // Chỉ thêm "VND" khi hiển thị
        }
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
                                <td className={styles['manageservices-td']}>{formatPrice(service.servicePrice)}</td>
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
                            onChange={handleServicePriceChange}
                        />
                        <select
                            value={serviceStatus}
                            onChange={(e) => setServiceStatus(e.target.value)}
                        >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                        <div className={styles['popup-buttons']}>
                            <button
                                className={styles['manageservices-button']}
                                onClick={editingServiceId ? handleUpdateService : handleAddService}
                            >
                                {editingServiceId ? 'Update Service' : 'Add Service'}
                            </button>
                            <button
                                className={styles['manageservices-button']}
                                onClick={closePopup}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteConfirmationOpen && (
                <div className={styles['delete-confirmation-overlay']}>
                    <div className={styles['delete-confirmation-box']}>
                        <h3>Are you sure you want to delete this service?</h3>
                        <div className={styles['popup-buttons']}>
                            <button className={styles['manageservices-button']} onClick={handleDeleteService}>
                                Yes, Delete
                            </button>
                            <button
                                className={styles['manageservices-button']}
                                onClick={() => setIsDeleteConfirmationOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageServices;
