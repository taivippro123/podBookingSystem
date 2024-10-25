import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList, FaSignOutAlt, FaBars } from 'react-icons/fa';
import styles from './Staff.module.css';
import LogoutButton from '../../components/LogoutButton/LogoutButton'; // Import nút Logout

const Staff = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.managementTitle}>Staff Dashboard</h1>
            </header>
            <nav className={`${styles.nav} ${isMenuVisible ? styles.visible : styles.hidden}`}>
                <Link to="/staff" className={styles.staffTitle}>
                    <h1>Staff</h1>
                </Link>
                <ul>
                    <li>
                        <Link to="/staff/upcoming-bookings" className={styles.navLink}>
                            <FaCalendarAlt className={styles.icon} />
                            <span>View Upcoming Bookings</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/staff/upcoming-services" className={styles.navLink}>
                            <FaClipboardList className={styles.icon} />
                            <span>View Services Added</span>
                        </Link>
                    </li>
                </ul>
                <div className={styles.logoutContainer}>
                    {/* Thay thế Link sang LogoutButton */}
                    <LogoutButton />
                </div>
            </nav>
            <button className={`${styles.menuToggle} ${isMenuVisible ? styles.menuToggleVisible : styles.menuToggleHidden}`} onClick={toggleMenu}>
                <FaBars />
            </button>
            <div className={`${styles.mainContent} ${isMenuVisible ? '' : styles.menuHidden}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default Staff;
