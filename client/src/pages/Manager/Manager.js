import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaClock, FaClipboardList, FaBars, FaHome, FaUserShield } from 'react-icons/fa';
import { LuDoorOpen } from 'react-icons/lu'; // Make sure to install this icon library if you haven't
import { GrTask } from 'react-icons/gr';
import { CalendarIcon } from '@heroicons/react/24/outline'; // Cập nhật import cho Heroicons v2
import styles from './Manager.module.css'; // Use a specific CSS file for Manager if needed
import LogoutButton from '../../components/LogoutButton/LogoutButton';

const Manager = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [activeLink, setActiveLink] = useState('/manager'); // State cho link đang hoạt động

    const toggleMenu = () => {
        setIsMenuVisible(prevState => !prevState);
    };

    const handleLinkClick = (link) => {
        setActiveLink(link); // Cập nhật link đang hoạt động
    };

    return (
        <div className={styles['manager-container']}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container mx-auto flex justify-center">
                    <Link to="/" className="text-2xl font-bold text-blue-900 flex justify-center items-center">
                        <CalendarIcon className="h-6 w-6" /> Work
                        <span className="text-blue-500"> Zone</span>
                    </Link>
                </div>
            </header>

            {/* Navigation */}
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

            {/* Toggle Menu Button */}
            <button
                className={`${styles['manager-menuToggle']}`}
                onClick={toggleMenu}
                style={{ left: isMenuVisible ? '250px' : '0px' }} // Điều chỉnh vị trí khi menu ẩn/hiện
            >
                <FaBars />
            </button>

            {/* Main Content */}
            <main className={`${styles['manager-mainContent']} ${isMenuVisible ? '' : styles['manager-menuHidden']}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default Manager;
