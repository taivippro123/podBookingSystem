import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList, FaBars, FaHome } from 'react-icons/fa';
import { CalendarIcon } from '@heroicons/react/24/outline'; // Cập nhật import cho Heroicons v2
import styles from './Staff.module.css';
import LogoutButton from '../../components/LogoutButton/LogoutButton';

const Staff = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [activeLink, setActiveLink] = useState('/staff'); // State cho link đang hoạt động

    const toggleMenu = () => {
        setIsMenuVisible(prevState => !prevState);
    };

    const handleLinkClick = (link) => {
        setActiveLink(link); // Cập nhật link đang hoạt động
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className="container mx-auto flex justify-center">
                    <Link to="/" className="text-2xl font-bold text-blue-900 flex justify-center items-center">
                        <CalendarIcon className="h-6 w-6" /> Work
                        <span className="text-blue-500"> Zone</span>
                    </Link>
                </div>
            </header>
            <nav className={`${styles.nav} ${isMenuVisible ? styles.visible : styles.hidden}`}>
                <Link to="/staff" className={styles.staffTitle}>
                    <h1>STAFF</h1>
                </Link>
                <ul>
                    <li>
                        <Link
                            to="/staff/upcoming-bookings"
                            className={`${styles.navLink} ${activeLink === '/staff/upcoming-bookings' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('/staff/upcoming-bookings')}
                        >
                            <FaCalendarAlt className={styles.icon} />
                            <span>View Upcoming Bookings</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/staff/upcoming-services"
                            className={`${styles.navLink} ${activeLink === '/staff/upcoming-services' ? styles.active : ''}`}
                            onClick={() => handleLinkClick('/staff/upcoming-services')}
                        >
                            <FaClipboardList className={styles.icon} />
                            <span>View Services Added</span>
                        </Link>
                    </li>
                </ul>
                <div className={styles.logoutContainer}>
                    <LogoutButton />
                </div>
            </nav>
            <button
                className={`${styles.menuToggle} ${isMenuVisible ? styles.menuToggleVisible : styles.menuToggleHidden}`}
                onClick={toggleMenu}
                aria-label={isMenuVisible ? 'Hide menu' : 'Show menu'}
            >
                <FaBars />
            </button>
            <div className={`${styles.mainContent} ${isMenuVisible ? '' : styles.menuHidden}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default Staff;
