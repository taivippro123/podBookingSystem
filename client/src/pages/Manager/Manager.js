import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaClock, FaUserShield, FaClipboardList, FaBars } from 'react-icons/fa';
import { GrTask } from 'react-icons/gr';
import { LuDoorOpen } from 'react-icons/lu';
import styles from './Manager.module.css';
import LogoutButton from '../../components/LogoutButton/LogoutButton';

const Manager = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [activeLink, setActiveLink] = useState('/manager'); // Thêm trạng thái để theo dõi nút được chọn

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleLinkClick = (link) => {
        setActiveLink(link); // Cập nhật nút được chọn khi nhấn
    };

    return (
        <div className={styles['manager-container']}>
            <header className={styles['manager-header']}>
                <h1 className={styles.managementTitle}>Manager Dashboard</h1>
            </header>
            <nav className={`${styles['manager-nav']} ${isMenuVisible ? styles['manager-visible'] : styles['manager-hidden']}`}>
                <Link to="/manager" className={styles.ManagerTitle} onClick={() => handleLinkClick('/manager')}>
                    <h1>Manager</h1>
                </Link>
                <ul>
                    <li>
                        <Link
                            to="/manager/manageRooms"
                            className={`${styles['manager-navLink']} ${activeLink === '/manager/manageRooms' ? styles['active'] : ''}`}
                            onClick={() => handleLinkClick('/manager/manageRooms')}
                        >
                            <LuDoorOpen className={styles['manager-icon']} />
                            <span>Manage Rooms</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/manager/manageSlots"
                            className={`${styles['manager-navLink']} ${activeLink === '/manager/manageSlots' ? styles['active'] : ''}`}
                            onClick={() => handleLinkClick('/manager/manageSlots')}
                        >
                            <FaClock className={styles['manager-icon']} />
                            <span>Manage Slots</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/manager/manageServices"
                            className={`${styles['manager-navLink']} ${activeLink === '/manager/manageServices' ? styles['active'] : ''}`}
                            onClick={() => handleLinkClick('/manager/manageServices')}
                        >
                            <FaClipboardList className={styles['manager-icon']} />
                            <span>Manage Services</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/manager/manageAccounts"
                            className={`${styles['manager-navLink']} ${activeLink === '/manager/manageAccounts' ? styles['active'] : ''}`}
                            onClick={() => handleLinkClick('/manager/manageAccounts')}
                        >
                            <FaUserShield className={styles['manager-icon']} />
                            <span>Manage Accounts</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/manager/manageBookings"
                            className={`${styles['manager-navLink']} ${activeLink === '/manager/manageBookings' ? styles['active'] : ''}`}
                            onClick={() => handleLinkClick('/manager/manageBookings')}
                        >
                            <GrTask className={styles['manager-icon']} />
                            <span>Manage Bookings</span>
                        </Link>
                    </li>
                </ul>
                <div className={styles.logoutContainer}>
                    <LogoutButton />
                </div>
            </nav>
            <button
                className={`${styles['manager-menuToggle']}`}
                onClick={toggleMenu}
                style={{ left: isMenuVisible ? '200px' : '20px' }} // Điều chỉnh vị trí khi menu ẩn/hiện
            >
                <FaBars />
            </button>
            <main className={`${styles['manager-mainContent']} ${isMenuVisible ? '' : styles['manager-menuHidden']}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default Manager;
