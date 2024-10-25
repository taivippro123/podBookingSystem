import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewTransactions.module.css';

function ViewTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch transactions data from the server
    axios.get('http://localhost:5000/admin/transactions')
      .then(response => {
        setTransactions(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load transactions data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.loading}>Loading transactions...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Transactions</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Booking ID</th>
            <th>User ID</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Event Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.transactionId}>
              <td>{transaction.transactionId}</td>
              <td>{transaction.bookingId}</td>
              <td>{transaction.userId}</td>
              <td>{transaction.eventDescription}</td>
              <td>{transaction.transactionType}</td>
              <td>{transaction.transactionAmount}</td>
              <td>{new Date(transaction.eventDate).toLocaleString()}</td>
              <td>{transaction.transactionStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewTransactions;
