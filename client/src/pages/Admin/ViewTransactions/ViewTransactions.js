import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewTransactions.module.css';

function ViewTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/admin/transactions')
      .then(response => {
        setTransactions(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load transactions data');
        setLoading(false);
      });
  }, []);

  // Hàm định dạng số tiền
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  if (loading) return <p className={styles.loading}>Loading transactions...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key) {
      const order = sortConfig.direction === 'asc' ? 1 : -1;
      return (a[sortConfig.key] > b[sortConfig.key] ? 1 : -1) * order;
    }
    return 0;
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closePopup = () => {
    setSelectedTransaction(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>TRANSACTIONS</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('transactionId')} className={styles.sortable}>
              Transaction ID {sortConfig.key === 'transactionId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('bookingId')} className={styles.sortable}>
              Booking ID {sortConfig.key === 'bookingId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('userId')} className={styles.sortable}>
              User ID {sortConfig.key === 'userId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('eventDate')} className={styles.sortable}>
              Event Date {sortConfig.key === 'eventDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th></th> {/* Cột để chứa nút View Details */}
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map(transaction => (
            <tr key={transaction.transactionId}>
              <td>{transaction.transactionId}</td>
              <td>{transaction.bookingId}</td>
              <td>{transaction.userId}</td>
              <td>{new Date(transaction.eventDate).toLocaleDateString()}</td>
              <td>
                <button
                  className={styles.viewButton}
                  onClick={() => handleViewDetails(transaction)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
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

      {selectedTransaction && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button className={styles.closeButton} onClick={closePopup}>X</button>
            <div className={styles.header}>
              <h2>Transaction Details</h2>
              <div className={styles.details}>
                <p><strong>Description:</strong> <span>{selectedTransaction.eventDescription}</span></p>
                <p><strong>Type:</strong> <span>{selectedTransaction.transactionType}</span></p>
                <p><strong>Amount:</strong> <span>{formatCurrency(selectedTransaction.transactionAmount)}</span></p> {/* Hiển thị Amount ở đây */}
                <p><strong>Status:</strong> <span>{selectedTransaction.transactionStatus}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTransactions;
