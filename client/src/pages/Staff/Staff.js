import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList, FaBars } from 'react-icons/fa';
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
                const response = await axios.get('http://localhost:5000/staff/upcoming-bookings');
    
                // Hàm formatPrice giúp định dạng giá theo kiểu Việt Nam
                const formatPrice = (price) => {
                    return Number(price).toLocaleString('vi-VN');  // Định dạng theo kiểu Việt Nam
                };
    
                // Tạo mảng các sự kiện từ StartDay đến EndDay
                const bookings = response.data.flatMap(booking => {
                    const startDay = dayjs(booking.bookingStartDay);
                    const endDay = dayjs(booking.bookingEndDay);
                    const eventDays = [];
    
                    // Lặp qua các ngày từ StartDay đến EndDay
                    for (let day = startDay; day.isBefore(endDay) || day.isSame(endDay, 'day'); day = day.add(1, 'day')) {
                        eventDays.push({
                            id: `${booking.bookingId}-${day.format('YYYY-MM-DD')}`, // Tạo id duy nhất cho từng ngày của booking
                            title: `Booking ID: ${booking.bookingId}`,
                            start: day.format('YYYY-MM-DD'),
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
                            className: styles.startEvent // Đặt màu nền cho các ngày trong khoảng
                        });
                    }
    
                    return eventDays;
                });
    
                // Sắp xếp các sự kiện theo ngày bắt đầu
                bookings.sort((a, b) => new Date(a.start) - new Date(b.start));
    
                // Cập nhật state events với danh sách sự kiện
                setEvents(bookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
    
        fetchBookings();
    }, []); // Chạy một lần khi component được mount
    

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
