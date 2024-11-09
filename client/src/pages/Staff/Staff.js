import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList, FaBars, FaHome } from 'react-icons/fa';
import { CalendarIcon } from '@heroicons/react/24/outline'; // Cập nhật import cho Heroicons v2
import styles from './Staff.module.css';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import MyCalendar from '../MyCalendar/MyCalendar';
import axios from 'axios';
import dayjs from 'dayjs';

const Staff = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [activeLink, setActiveLink] = useState('/staff'); // State cho link đang hoạt động
    const location = useLocation(); // Lấy URL hiện tại
    const [events, setEvents] = useState([]); // Dữ liệu sự kiện cho lịch
    // Hàm định dạng giá tiền

    const toggleMenu = () => {
        setIsMenuVisible(prevState => !prevState);
    };

    const handleLinkClick = (link) => {
        setActiveLink(link); // Cập nhật link đang hoạt động
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Fetch data from API
                const response = await axios.get('http://localhost:5000/manage/bookings');
    
                // Hàm formatPrice giúp định dạng giá theo kiểu Việt Nam
                const formatPrice = (price) => {
                    // Đảm bảo price là một số và sau đó định dạng theo kiểu Việt Nam
                    return Number(price).toLocaleString('vi-VN');  // Định dạng theo kiểu Việt Nam
                };
    
                // Chỉ lấy các sự kiện với StartDay, không cần EndDay nữa
                const bookings = response.data.map(booking => ({
                    id: booking.bookingId,
                    title: `Booking ID: ${booking.bookingId}`,
                    start: dayjs(booking.bookingStartDay).format('YYYY-MM-DD'),
                    description: (
                        <div className={styles.description}>
                            <h1 className={styles.upcomingBookings}>Upcoming Bookings</h1>
                            <p><strong>User ID:</strong> {booking.userId}</p>
                            <p><strong>Room ID:</strong> {booking.roomId}</p>
                            <p><strong>Start Day:</strong> {dayjs(booking.bookingStartDay).format('YYYY-MM-DD')}</p>
                            <p><strong>End Day:</strong> {dayjs(booking.bookingEndDay).format('YYYY-MM-DD')}</p>
                            <p><strong>Total Price:</strong> {formatPrice(booking.totalPrice)} VND</p>
                            <p><strong>Created At:</strong> {dayjs(booking.createdAt).format('YYYY-MM-DD')}</p>
                        </div>
                    ),
                    className: styles.startEvent // Green background for start day
                }));
    
                // Sắp xếp các sự kiện theo StartDay
                bookings.sort((a, b) => new Date(a.start) - new Date(b.start));
    
                // Loại bỏ sự kiện trùng lặp (nếu có) dựa trên bookingId
                const uniqueEvents = Array.from(new Map(bookings.map(item => [item.id, item])).values());
    
                // Set the events state with unique events
                setEvents(uniqueEvents);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
    
        fetchBookings();
    }, []); // Empty dependency array to run once on mount

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
                {location.pathname === '/staff' && <MyCalendar events={events} />}
            </div>
        </div>
    );
};

export default Staff;
