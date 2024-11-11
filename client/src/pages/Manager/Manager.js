import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaClock, FaClipboardList, FaBars, FaUserShield } from 'react-icons/fa';
import { LuDoorOpen } from 'react-icons/lu';
import { GrTask } from 'react-icons/gr';
import { CalendarIcon } from '@heroicons/react/24/outline';
import styles from './Manager.module.css';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import MyCalendar from '../MyCalendar/MyCalendar';
import axios from 'axios';
import dayjs from 'dayjs';

const Manager = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [activeLink, setActiveLink] = useState('/manager');
    const location = useLocation(); // Lấy URL hiện tại
    const [events, setEvents] = useState([]); // Dữ liệu sự kiện cho lịch
    // Hàm định dạng giá tiền
   
    

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
    


    const toggleMenu = () => {
        setIsMenuVisible(prevState => !prevState);
    };

    const handleLinkClick = (link) => {
        setActiveLink(link);
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
                style={{ left: isMenuVisible ? '250px' : '0px' }}
            >
                <FaBars />
            </button>

            {/* Main Content */}
            <main className={`${styles['manager-mainContent']} ${isMenuVisible ? '' : styles['manager-menuHidden']}`}>
                <Outlet />
                {/* Chỉ hiển thị MyCalendar khi ở trang chủ của Manager */}
                {location.pathname === '/manager' && <MyCalendar events={events} />}
            </main>
        </div>
    );
};

export default Manager;
