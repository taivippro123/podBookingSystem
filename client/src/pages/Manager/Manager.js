import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaClock, FaUserShield, FaClipboardList, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { GrTask } from 'react-icons/gr'; 
import { LuDoorOpen } from 'react-icons/lu'; 
import styles from './Manager.module.css';

const Manager = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    return (
        <div className={styles['manager-container']}>
            <header className={styles['manager-header']}>
                <h1 className={styles.managementTitle}>Manager Dashboard</h1>
            </header>
            <nav className={`${styles['manager-nav']} ${isMenuVisible ? styles['manager-visible'] : styles['manager-hidden']}`}>
                <Link to="/manager" className={styles.ManagerTitle}>
                    <h1>Manager</h1>
                </Link>
                <ul>
                    <li>
                        <Link to="/manager/manageRooms" className={styles['manager-navLink']}>
                            <LuDoorOpen className={styles['manager-icon']} />
                            <span>Manage Rooms</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/manager/manageSlot" className={styles['manager-navLink']}>
                            <FaClock className={styles['manager-icon']} />
                            <span>Manage Slots</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/manager/manageServices" className={styles['manager-navLink']}>
                            <FaClipboardList className={styles['manager-icon']} />
                            <span>Manage Services</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/manager/manageAccounts" className={styles['manager-navLink']}>
                            <FaUserShield className={styles['manager-icon']} />
                            <span>Manage Accounts</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/manager/manageBookings" className={styles['manager-navLink']}>
                            <GrTask className={styles['manager-icon']} />
                            <span>Manage Bookings</span>
                        </Link>
                    </li>
                </ul>
                <div className={styles['manager-logoutContainer']}>
                    <Link to="/manager/logout" className={styles['manager-navLink']}>
                        <FaSignOutAlt className={styles['manager-icon']} />
                        <span>Logout</span>
                    </Link>
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
