<<<<<<< HEAD
import React from 'react'
import Home from '../pages/Home/Home'
=======
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList, FaSignOutAlt, FaBars } from 'react-icons/fa';
import styles from './Staff.module.css';

const Staff = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };
>>>>>>> master

    return (
<<<<<<< HEAD
        <div>
            <Home />
        </div>
    )
}
=======
        <div className={`${styles.container}`}>
            <header className={styles.header}>
                <h1 className={styles.managementTitle}>Staff Dashboard</h1> {/* Căn giữa tiêu đề ở đây */}
            </header>
            <nav className={`${styles.nav} ${isMenuVisible ? styles.visible : styles.hidden}`}>
                <h1 className={styles.staffTitle}>Staff</h1> {/* Căn giữa tiêu đề ở đây */}
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
                    <Link to="/logout" className={styles.navLink}>
                        <FaSignOutAlt className={styles.icon} />
                        <span>Log Out</span>
                    </Link>
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
>>>>>>> master

export default Staff;
