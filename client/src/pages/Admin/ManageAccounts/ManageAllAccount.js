import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import styles from './ManageAllAccounts.module.css';
import { Modal, notification } from 'antd';

const ManageAllAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [viewAccount, setViewAccount] = useState(null); // State for viewing account details
    const [editedAccountId, setEditedAccountId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState(''); // New state for user email
    const [userPhone, setUserPhone] = useState(''); // New state for user phone
    const [userPoint, setUserPoint] = useState(''); // New state for user points
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
            notification.error({ message: 'Error fetching accounts', description: 'Could not load accounts. Please try again later.' });
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
        setUserEmail(account.userEmail); // Set email when editing
        setUserPhone(account.userPhone); // Set phone when editing
        setUserPoint(account.userPoint); // Set points when editing
        setUserRole(account.userRole);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/admin/accounts/${editedAccountId}`, {
                userName,
                userEmail,
                userPhone,
                userPoint,
                userRole
            });
            fetchAccounts(); // Refresh accounts after edit
            notification.success({ message: 'Success', description: 'Account updated successfully.' });
            setEditedAccountId(null);
        } catch (error) {
            console.error('Error updating account:', error);
            notification.error({ message: 'Update Failed', description: 'Could not update account. Please try again.' });
        }
    };

    const handleDeleteRequest = (userId) => {
        setDeleteAccountId(userId);
    };

    const handleDelete = async () => {
        if (deleteAccountId) {
            try {
                await axios.delete(`http://localhost:5000/admin/accounts/${deleteAccountId}`);
                fetchAccounts();
                notification.success({ message: 'Success', description: 'Account deleted successfully.' });
                setDeleteAccountId(null);
            } catch (error) {
                console.error('Error deleting account:', error);
                notification.error({ message: 'Delete Failed', description: 'Could not delete account. Please try again.' });
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
                        <th>Email</th> {/* New column for Email */}
                        <th>Phone</th> {/* New column for Phone */}
                        <th>Points</th> {/* New column for Points */}
                        <th>Role</th>
                        <th>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {currentAccounts.length > 0 ? (
                        currentAccounts.map((account) => (
                            <tr key={account.userId}>
                                <td>{account.userId}</td>
                                <td>{account.userName}</td>
                                <td>{account.userEmail}</td> {/* Display email */}
                                <td>{account.userPhone}</td> {/* Display phone */}
                                <td>{account.userPoint}</td> {/* Display points */}
                                <td>{getRoleName(account.userRole)}</td>
                                <td>
                                    <button onClick={() => handleEditClick(account)} title="Edit">
                                        <FaEdit color="black" size={30} />
                                    </button>
                                    <button onClick={() => handleDeleteRequest(account.userId)} title="Delete">
                                        <FaTrash color="red" size={30} />
                                    </button>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className={styles.noAccounts}>No accounts available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Edit Account Modal */}
            {editedAccountId && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <h3>Edit Account</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    value={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Points:</label>
                                <input
                                    type="number"
                                    value={userPoint}
                                    onChange={(e) => setUserPoint(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Role:</label>
                                <select
                                    value={userRole}
                                    onChange={(e) => setUserRole(e.target.value)}
                                    required
                                >
                                    <option value="1">Admin</option>
                                    <option value="2">Manager</option>
                                    <option value="3">Staff</option>
                                    <option value="4">User</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.submitButton}>Update</button>
                            <button
                                type="button"
                                onClick={() => setEditedAccountId(null)}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

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

            {/* Confirm Delete Modal */}
            {deleteAccountId && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        
                        <h2>Are you sure you want to delete this account?</h2>
                        <button onClick={handleDelete} className={styles.confirmDeleteButton}>Yes</button>
                        <button onClick={() => setDeleteAccountId(null)} className={styles.cancelDeleteButton}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAllAccounts;
