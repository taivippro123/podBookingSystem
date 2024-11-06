import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewFeedbacks.module.css'; // Import the CSS module

function ViewFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]); // State to hold feedback data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const feedbacksPerPage = 10; // Number of feedbacks per page

    // State for sorting
    const [sortField, setSortField] = useState('feedbackId');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    useEffect(() => {
        axios.get('http://localhost:5000/admin/feedback') // Fetch feedback from your API
            .then(response => {
                setFeedbacks(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching feedbacks');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading feedbacks...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Function to format feedback date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString(undefined, options); // Format: MM/DD/YYYY
    };

    // Function to sort feedbacks
    const sortFeedbacks = (field) => {
        const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
        const sortedFeedbacks = [...feedbacks].sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setFeedbacks(sortedFeedbacks);
        setSortField(field);
        setSortOrder(order);
    };

    // Calculate pagination indices
    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
    const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Render sort arrow based on current sort field and order
    const renderSortArrow = (field) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return null;
    };

    return (
        <div className={styles['feedback-container']}>
            <h1 className={styles.headerTitle}>FEEDBACKS</h1>
            {currentFeedbacks.length > 0 ? (
                <table className={styles['feedback-table']}>
                    <thead>
                        <tr>
                            <th onClick={() => sortFeedbacks('feedbackId')}>
                                Feedback ID {renderSortArrow('feedbackId')}
                            </th>
                            <th onClick={() => sortFeedbacks('bookingId')}>
                                Booking ID {renderSortArrow('bookingId')}
                            </th>
                            <th onClick={() => sortFeedbacks('userId')}>
                                User ID {renderSortArrow('userId')}
                            </th>
                            <th onClick={() => sortFeedbacks('rating')}>
                                Rating {renderSortArrow('rating')}
                            </th>
                            <th>Feedback</th>
                            <th onClick={() => sortFeedbacks('feedbackDate')}>
                                Feedback Date {renderSortArrow('feedbackDate')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFeedbacks.map(feedback => (
                            <tr key={feedback.feedbackId}>
                                <td>{feedback.feedbackId}</td>
                                <td>{feedback.bookingId}</td>
                                <td>{feedback.userId}</td>
                                <td>{feedback.rating}</td>
                                <td>{feedback.feedback}</td>
                                <td>{formatDate(feedback.feedbackDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className={styles['feedback-empty']}>No feedbacks available.</p>
            )}

            {/* Pagination section */}
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
        </div>
    );
}

export default ViewFeedbacks;
