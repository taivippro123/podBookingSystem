// src/components/Pagination.js
import React from 'react';
import styles from './Pagination.module.css'; // Đường dẫn tới file CSS

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleClick = (page) => {
        if (page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <div className={styles.pagination}>
            <button
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
            >
                &lt; {/* Nút trước */}
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handleClick(index + 1)}
                    className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                >
                    {index + 1}
                </button>
            ))}

            <button
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
            >
                &gt; {/* Nút sau */}
            </button>
        </div>
    );
};

export default Pagination;
