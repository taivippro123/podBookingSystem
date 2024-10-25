import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import styles from './ManageBookings.module.css'; // Import CSS module

// Đặt thuộc tính cho modal
Modal.setAppElement('#root'); // Cung cấp app root element cho accessibility

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Fetch bookings when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/manage/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setStatusMessage('Error fetching bookings. Please try again later.');
      }
    };

    fetchBookings();
  }, []);

  // Function to handle status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/manage/bookings/${bookingId}/status`, { bookingStatus: newStatus });
      setStatusMessage(response.data.message);
      setIsModalOpen(true); // Mở modal khi trạng thái cập nhật thành công

      // Đóng modal tự động sau 5 giây
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);

      // Update bookings list after status update
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.bookingId === bookingId ? { ...booking, bookingStatus: newStatus } : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      if (error.response && error.response.status === 404) {
        setStatusMessage('Booking not found.');
      } else {
        setStatusMessage('Failed to update booking status. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Bookings</h2>
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
                <td>
                  <select
                    className={styles.statusSelect}
                    value={booking.bookingStatus} // Set value as the current status
                    onChange={(e) => handleStatusUpdate(booking.bookingId, e.target.value)} // Update status on change
                  >
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Using">Using</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No bookings available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for status update message */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)} // Có thể tự động đóng modal
        contentLabel="Status Update"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Status Update</h2>
        <p>{statusMessage}</p>
      </Modal>
    </div>
  );
};

export default ManageBookings;
