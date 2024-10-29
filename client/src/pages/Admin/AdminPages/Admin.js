import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaClock, FaUserShield, FaClipboardList, FaBars, FaMoneyBillWave } from 'react-icons/fa';
import { GrTask } from 'react-icons/gr';
import { LuDoorOpen } from 'react-icons/lu';
import { BsPeopleFill } from 'react-icons/bs';
import styles from './Admin.module.css';
import LogoutButton from '../../../components/LogoutButton/LogoutButton';
import ViewNumberAccounts from '../ViewNumberAccounts/ViewNumberAccounts'; 
import ViewPopularRooms from '../ViewPopularRooms/ViewPopularRooms';     
import ViewPopularServices from '../ViewPopularServices/ViewPopularServices'; 

const Admin = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    // Kiểm tra xem đang ở trang chủ hay không
    const isHomePage = location.pathname === '/admin';

    return (
        <div className={styles['Admin-container']}>
            <header className={styles['Admin-header']}>
                <h1 className={styles.adminTitle}>Admin Dashboard</h1>
            </header>
            <nav className={`${styles['Admin-nav']} ${isMenuVisible ? styles['Admin-visible'] : styles['Admin-hidden']}`}>
                <Link to="/admin" className={styles.AdminTitle}>
                    <h1>Admin</h1>
                </Link>
                <ul>
                    <li>
                        <Link
                            to="/admin/accounts"
                            className={`${styles['Admin-navLink']} ${location.pathname === '/admin/accounts' ? styles['Admin-navLink-active'] : ''}`}
                        >
                            <FaUserShield className={styles['Admin-icon']} />
                            <span>Manage Accounts</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/transactions"
                            className={`${styles['Admin-navLink']} ${location.pathname === '/admin/transactions' ? styles['Admin-navLink-active'] : ''}`}
                        >
                            <FaMoneyBillWave className={styles['Admin-icon']} />
                            <span>View Transactions</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/number-accounts"
                            className={`${styles['Admin-navLink']} ${location.pathname === '/admin/number-accounts' ? styles['Admin-navLink-active'] : ''}`}
                        >
                            <BsPeopleFill className={styles['Admin-icon']} />
                            <span>Number of Accounts</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/popular-rooms"
                            className={`${styles['Admin-navLink']} ${location.pathname === '/admin/popular-rooms' ? styles['Admin-navLink-active'] : ''}`}
                        >
                            <LuDoorOpen className={styles['Admin-icon']} />
                            <span>Popular Rooms</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/popular-services"
                            className={`${styles['Admin-navLink']} ${location.pathname === '/admin/popular-services' ? styles['Admin-navLink-active'] : ''}`}
                        >
                            <GrTask className={styles['Admin-icon']} />
                            <span>Popular Services</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/feedback"
                            className={`${styles['Admin-navLink']} ${location.pathname === '/admin/feedback' ? styles['Admin-navLink-active'] : ''}`}
                        >
                            <FaClipboardList className={styles['Admin-icon']} />
                            <span>View Feedbacks</span>
                        </Link>
                    </li>
                </ul>
                <div className={styles.logoutContainer}>
                    <LogoutButton />
                </div>
            </nav>
            <button
                className={styles['Admin-menuToggle']}
                onClick={toggleMenu}
                style={{ left: isMenuVisible ? '200px' : '20px' }}
            >
                <FaBars />
            </button>
            <main className={`${styles['Admin-mainContent']} ${isMenuVisible ? '' : styles['Admin-menuHidden']}`}>
                {isHomePage && (
                    <div className={styles.chartContainer}>
                        <div className={styles.chartItem}>
                            <ViewPopularRooms />
                        </div>
                        <div className={styles.chartItem}>
                            <ViewPopularServices />
                        </div>
                        <div className={styles.chartTotalAccounts}>
                            <ViewNumberAccounts />
                        </div>
                    </div>
                )}
                <Outlet />
            </main>
        </div>
    );
};

export default Admin;
