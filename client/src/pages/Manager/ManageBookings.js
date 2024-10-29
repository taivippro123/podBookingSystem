import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import styles from './ManageBookings.module.css'; // Import CSS module

// Đặt thuộc tính cho modal
Modal.setAppElement('#root'); // Cung cấp app root element cho accessibility

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' }); // Trạng thái sắp xếp
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [bookingsPerPage] = useState(10); // Số bookings trên mỗi trang

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/manage/bookings');
        setBookings(response.data);
        setFilteredBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setStatusMessage('Error fetching bookings. Please try again later.');
      }
    };

    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/manage/bookings/${bookingId}/status`, { bookingStatus: newStatus });
      setStatusMessage(response.data.message);
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);

      const updatedBookings = bookings.map(booking =>
        booking.bookingId === bookingId ? { ...booking, bookingStatus: newStatus } : booking
      );

      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
    } catch (error) {
      console.error('Error updating booking status:', error);
      if (error.response && error.response.status === 404) {
        setStatusMessage('Booking not found.');
      } else {
        setStatusMessage('Failed to update booking status. Please try again.');
      }
    }
  };

  const sortBookings = (key) => {
    let direction = 'ascending';

    // Đổi chiều sắp xếp nếu đã sắp xếp theo cùng một key
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedBookings = [...filteredBookings].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setFilteredBookings(sortedBookings);
    setSortConfig({ key, direction });
  };

  const filterByStatus = (status) => {
    if (status === 'All') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => booking.bookingStatus === status);
      setFilteredBookings(filtered);
    }
    setCurrentPage(1); // Reset trang khi thay đổi filter
  };

  // Tính toán chỉ số bookings hiển thị
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage); // Tổng số trang

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1; // Không cho phép trang nhỏ hơn 1
    if (pageNumber > totalPages) pageNumber = totalPages; // Không cho phép trang lớn hơn tổng số trang
    setCurrentPage(pageNumber); // Cập nhật trang hiện tại
  };

  return (
    <div className={styles.container}>
      <h2>Manage Bookings</h2>

      {/* Filter buttons for status */}
      <div className={styles.roleFilter}>
        <button onClick={() => filterByStatus('All')}>All</button>
        <button onClick={() => filterByStatus('Cancelled')}>Cancelled</button>
        <button onClick={() => filterByStatus('Refunded')}>Refunded</button>
        <button onClick={() => filterByStatus('Upcoming')}>Upcoming</button>
        <button onClick={() => filterByStatus('Using')}>Using</button>
        <button onClick={() => filterByStatus('Completed')}>Completed</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => sortBookings('bookingId')}>Booking ID</th>
            <th onClick={() => sortBookings('userId')}>User ID</th>
            <th onClick={() => sortBookings('roomId')}>Room ID</th>
            <th onClick={() => sortBookings('bookingStartDay')}>Start Day</th>
            <th onClick={() => sortBookings('bookingEndDay')}>End Day</th>
            <th onClick={() => sortBookings('totalPrice')}>Total Price</th>
            <th onClick={() => sortBookings('bookingStatus')}>Status</th>
            <th onClick={() => sortBookings('createdAt')}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.length > 0 ? (
            currentBookings.map((booking) => (
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
                    value={booking.bookingStatus}
                    onChange={(e) => handleStatusUpdate(booking.bookingId, e.target.value)}
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

      {/* Pagination controls */}
      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? styles.active : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>

      {/* Modal for status update message */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
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
