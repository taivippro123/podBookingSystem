import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewFeedbacks.module.css'; // Import the CSS module

function ViewFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const feedbacksPerPage = 10; // Số feedback mỗi trang

    useEffect(() => {
        axios.get('http://localhost:5000/admin/feedback')
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

    // Tính toán các chỉ số để phân trang
    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
    const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

    return (
        <div className={styles['feedback-container']}>
            <h1 className={styles['feedback-title']}>Feedback List</h1>
            {currentFeedbacks.length > 0 ? (
                <table className={styles['feedback-table']}>
                    <thead>
                        <tr>
                            <th>Feedback ID</th>
                            <th>Booking ID</th>
                            <th>User ID</th>
                            <th>Rating</th>
                            <th>Feedback</th>
                            <th>Feedback Date</th>
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

            {/* Phần phân trang */}
            <div className={styles.pagination}>
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1}
                >
                    &lt; {/* Biểu tượng cho nút Previous */}
                </button>
                <span>{currentPage} of {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                >
                    &gt; {/* Biểu tượng cho nút Next */}
                </button>
            </div>
        </div>
    );
}

export default ViewFeedbacks;
