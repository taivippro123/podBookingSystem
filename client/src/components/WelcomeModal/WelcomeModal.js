// src/components/WelcomeModal.js
import React, { useState } from 'react';
import styles from './WelcomeModal.module.css'; // Tạo file CSS riêng cho Modal

const WelcomeModal = ({ title = "WELCOME TO WORKZONE", message = "Hi, Manager. Have you got any plans for today? Have a great day.", onClose }) => {
    const [isModalVisible, setIsModalVisible] = useState(true); // Hiện modal mặc định

    // Đóng modal khi bấm nút đóng
    const closeModal = () => {
        setIsModalVisible(false);
        if (onClose) onClose(); // Gọi hàm onClose nếu có
    };

    return (
        <>
            {isModalVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>{title}</h2>
                        <p className={styles.modalMessage}>{message}</p>
                        <div className={styles.handWave}>👋</div>
                        <button className={styles.closeButton} onClick={closeModal}>Thank you</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default WelcomeModal;
