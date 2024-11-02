import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import styles from './ManageAllAccounts.module.css';

const ManageAllAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [viewAccount, setViewAccount] = useState(null); // State for viewing account details
    const [editedAccountId, setEditedAccountId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 10;
    const [sortConfig, setSortConfig] = useState({ key: 'userId', direction: 'ascending' });
    const [selectedRole, setSelectedRole] = useState('All');
    const [deleteAccountId, setDeleteAccountId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update search query
    };

    const handleViewDetails = (account) => {
        setViewAccount(account); // Set the selected account for viewing
    };

    const handleEditClick = (account) => {
        setEditedAccountId(account.userId);
        setUserName(account.userName);
        setUserRole(account.userRole);
    };

    const handleDeleteRequest = (userId) => {
        setDeleteAccountId(userId);
    };

    const handleDelete = async () => {
        if (deleteAccountId) {
            try {
                await axios.delete(`http://localhost:5000/admin/accounts/${deleteAccountId}`);
                fetchAccounts();
                setDeleteAccountId(null);
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1:
                return 'Admin';
            case 2:
                return 'Manager';
            case 3:
                return 'Staff';
            case 4:
                return 'User';
            default:
                return 'Unknown';
        }
    };

    // Filter and search accounts based on role and search query
    const filteredAccounts = accounts.filter(account => {
        const matchesRole = selectedRole === 'All' || getRoleName(account.userRole) === selectedRole;
        const matchesSearch = account.userName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const indexOfLastAccount = currentPage * accountsPerPage;
    const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
    const currentAccounts = sortedAccounts.slice(indexOfFirstAccount, indexOfLastAccount);
    const totalPages = Math.ceil(sortedAccounts.length / accountsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={styles.container}>
            <h1 className={styles.headerTitle}>MANAGE ACCOUNTS</h1>

            {/* Search and Role Selection Container */}
            <div className={styles.searchRoleContainer}>
                {/* Search Input */}
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                    <button className={styles.searchButton} onClick={() => {/* thêm logic tìm kiếm nếu cần */ }}>
                        <FaSearch className={styles.searchIcon} />
                    </button>
                </div>

                {/* Role Selection Buttons */}
                <div className={styles.roleButtons}>
                    {['Admin', 'Manager', 'Staff', 'User', 'All'].map(role => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`${styles.button} ${selectedRole === role ? styles.selected : ''}`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>


            {/* Accounts Table */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                        <th></th> {/* New column for View Details button */}
                    </tr>
                </thead>
                <tbody>
                    {currentAccounts.length > 0 ? (
                        currentAccounts.map((account) => (
                            <tr key={account.userId}>
                                <td>{account.userId}</td>
                                <td>{account.userName}</td>
                                <td>{getRoleName(account.userRole)}</td>
                                <td>
                                    <button onClick={() => handleEditClick(account)} title="Edit">
                                        <FaEdit color="black" size={30} />
                                    </button>
                                    <button onClick={() => handleDeleteRequest(account.userId)} title="Delete">
                                        <FaTrash color="red" size={30} />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleViewDetails(account)}
                                        className={styles.viewDetailsButton}
                                        title="View Details"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className={styles.noAccounts}>No accounts available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Previous Page"
                >
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
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                >
                    &gt;
                </button>
            </div>

            {/* Modal for Viewing Account Details */}
            {viewAccount && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <h3>Account Details</h3>
                        <p><strong>Email:</strong> {viewAccount.userEmail}</p>
                        <p><strong>Phone:</strong> {viewAccount.userPhone}</p>
                        <p><strong>Points:</strong> {viewAccount.userPoint}</p>
                        <button onClick={() => setViewAccount(null)}>Close</button>
                    </div>
                </div>
            )}

            {/* Modal for Confirming Deletion */}
            {deleteAccountId && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this account?</p>
                        <button onClick={handleDelete}>Yes, delete</button>
                        <button onClick={() => setDeleteAccountId(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAllAccounts;
