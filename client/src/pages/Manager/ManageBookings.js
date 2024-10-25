import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ManageBookings.module.css'; // Import CSS module

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch bookings when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/manage/bookings'); // Gọi API để lấy danh sách bookings
        setBookings(response.data); // Cập nhật state bookings
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setStatusMessage('Error fetching bookings. Please try again later.');
      }
    };

    fetchBookings();
  }, []);

  // Function to handle status update
  const handleStatusUpdate = async (bookingId) => {
    if (!newStatus) {
      setStatusMessage('Please select a valid status.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/manage/bookings/${bookingId}/status`, { bookingStatus: newStatus });
      setStatusMessage(response.data.message); // Hiển thị thông báo cập nhật thành công

      // Cập nhật danh sách bookings sau khi cập nhật trạng thái
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.bookingId === bookingId ? { ...booking, bookingStatus: newStatus } : booking
        )
      );
      setNewStatus(''); // Reset trạng thái đã chọn
    } catch (error) {
      console.error('Error updating booking status:', error);
      if (error.response && error.response.status === 404) {
        setStatusMessage('Booking not found.'); // Thông báo nếu không tìm thấy booking
      } else {
        setStatusMessage('Failed to update booking status. Please try again.'); // Thông báo lỗi chung
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Bookings</h2>
      {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User ID</th>
            <th>Room ID</th>
            <th>Start Day</th>
            <th>End Day</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{booking.userId}</td>
                <td>{booking.roomId}</td>
                <td>{new Date(booking.bookingStartDay).toLocaleDateString()}</td>
                <td>{new Date(booking.bookingEndDay).toLocaleDateString()}</td>
                <td>{booking.totalPrice}</td>
                <td>{booking.bookingStatus}</td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    className={styles.statusSelect}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Using">Using</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    className={styles.updateButton}
                    onClick={() => handleStatusUpdate(booking.bookingId)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No bookings available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBookings;
