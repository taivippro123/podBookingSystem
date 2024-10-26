import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaClock, FaUserShield, FaClipboardList, FaBars, FaMoneyBillWave } from 'react-icons/fa';
import { GrTask } from 'react-icons/gr';
import { LuDoorOpen } from 'react-icons/lu';
import { BsPeopleFill } from 'react-icons/bs';
import styles from './Admin.module.css';
import LogoutButton from '../../../components/LogoutButton/LogoutButton';

const Admin = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

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
                        <Link to="/admin/accounts" className={styles['Admin-navLink']}>
                            <FaUserShield className={styles['Admin-icon']} />
                            <span>Manage Accounts</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/transactions" className={styles['Admin-navLink']}>
                            <FaMoneyBillWave className={styles['Admin-icon']} />
                            <span>View Transactions</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/number-accounts" className={styles['Admin-navLink']}>
                            <BsPeopleFill className={styles['Admin-icon']} />
                            <span>Number of Accounts</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/popular-rooms" className={styles['Admin-navLink']}>
                            <LuDoorOpen className={styles['Admin-icon']} />
                            <span>Popular Rooms</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/popular-services" className={styles['Admin-navLink']}>
                            <GrTask className={styles['Admin-icon']} />
                            <span>Popular Services</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/feedback" className={styles['Admin-navLink']}>
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
                style={{ left: isMenuVisible ? '200px' : '20px' }} // Điều chỉnh vị trí khi menu ẩn/hiện
            >
                <FaBars />
            </button>
            <main className={`${styles['Admin-mainContent']} ${isMenuVisible ? '' : styles['Admin-menuHidden']}`}>
                <Outlet /> {/* Đây sẽ là nơi render các component con */}
            </main>
        </div>
    );
};

export default Admin;
