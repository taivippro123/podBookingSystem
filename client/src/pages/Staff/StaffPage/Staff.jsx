import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './Staff.css';

const Staff = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    return (
        <div className={`container ${isMenuVisible ? 'menu-visible' : 'menu-hidden'}`}>
            <header className="header">
                <h1></h1>
            </header>
            <nav className={`nav ${isMenuVisible ? 'visible' : 'hidden'}`}>
                <h1>Staff</h1>
                <ul>
                    <li>
                        <Link to="/staff/upcoming-bookings">
                            <FaCalendarAlt className="icon" />
                            <span>View Upcoming Bookings</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/staff/upcoming-services">
                            <FaClipboardList className="icon" />
                            <span>View Services Added</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile">
                            <FaUser className="icon" />
                            <span>View Profile</span>
                        </Link>
                    </li>
                </ul>
                <div className="logout-container">
                    <Link to="/logout">
                        <FaSignOutAlt className="icon" />
                        <span>Log Out</span>
                    </Link>
                </div>
            </nav>
            <button className="menu-toggle" onClick={toggleMenu}>
                <FaBars />
            </button>
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default Staff;
