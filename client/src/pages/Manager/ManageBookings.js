import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, notification } from 'antd'; // Import Modal và notification từ antd
import styles from './ManageBookings.module.css'; // Import CSS module

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/manage/bookings');
        setBookings(response.data);
        setFilteredBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        notification.error({
          message: 'Error',
          description: 'Error fetching bookings. Please try again later.',
        });
      }
    };

    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/manage/bookings/${bookingId}/status`, { bookingStatus: newStatus });
      
      notification.success({
        message: 'Success',
        description: response.data.message,
      });

      const updatedBookings = bookings.map(booking =>
        booking.bookingId === bookingId ? { ...booking, bookingStatus: newStatus } : booking
      );

      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
    } catch (error) {
      console.error('Error updating booking status:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update booking status. Please try again.',
      });
    }
  };

  const filterByStatus = (status) => {
    if (status === 'All') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => booking.bookingStatus === status);
      setFilteredBookings(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>MANAGE BOOKINGS</h1>

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
            <th>Booking ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.length > 0 ? (
            currentBookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
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
                <td>
                  <button className={styles.viewDetailsButton} onClick={() => openDetailsModal(booking)}>View Details</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No bookings available.</td>
            </tr>
          )}
        </tbody>
      </table>

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

      {/* Modal for viewing booking details */}
      <Modal
        title="Booking Details"
        visible={isDetailsModalOpen}
        onCancel={closeDetailsModal}
        footer={[
          <button key="close" onClick={closeDetailsModal}>
            Close
          </button>,
        ]}
      >
        {selectedBooking && (
          <div>
            <p><strong>User ID:</strong> {selectedBooking.userId}</p>
            <p><strong>Room ID:</strong> {selectedBooking.roomId}</p>
            <p><strong>Start Day:</strong> {new Date(selectedBooking.bookingStartDay).toLocaleDateString()}</p>
            <p><strong>End Day:</strong> {new Date(selectedBooking.bookingEndDay).toLocaleDateString()}</p>
            <p><strong>Total Price:</strong> {formatPrice(selectedBooking.totalPrice)}</p>
            <p><strong>Created At:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageBookings;
