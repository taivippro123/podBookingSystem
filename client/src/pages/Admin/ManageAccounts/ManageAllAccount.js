import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './ManageAllAccounts.module.css';

const ManageAllAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [editedAccountId, setEditedAccountId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userPoint, setUserPoint] = useState('');
    const [userRole, setUserRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 10;
    const [sortConfig, setSortConfig] = useState({ key: 'userId', direction: 'ascending' });
    const [selectedRole, setSelectedRole] = useState('All');
    const [deleteAccountId, setDeleteAccountId] = useState(null); // State for delete confirmation modal

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

    const handleEditClick = (account) => {
        setEditedAccountId(account.userId);
        setUserName(account.userName);
        setUserEmail(account.userEmail);
        setUserPassword('');
        setUserPhone(account.userPhone);
        setUserPoint(account.userPoint);
        setUserRole(account.userRole);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/admin/accounts/${editedAccountId}`, {
                userName,
                userEmail,
                userPassword,
                userPhone,
                userPoint,
                userRole,
            });
            fetchAccounts();
            resetForm();
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    const handleDeleteRequest = (userId) => {
        setDeleteAccountId(userId); // Set the account ID to delete
    };

    const handleDelete = async () => {
        if (deleteAccountId) {
            try {
                await axios.delete(`http://localhost:5000/admin/accounts/${deleteAccountId}`);
                fetchAccounts();
                setDeleteAccountId(null); // Reset the delete ID
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    const resetForm = () => {
        setEditedAccountId(null);
        setUserName('');
        setUserEmail('');
        setUserPassword('');
        setUserPhone('');
        setUserPoint('');
        setUserRole('');
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

    const filteredAccounts = selectedRole === 'All' ? accounts : accounts.filter(account => getRoleName(account.userRole) === selectedRole);
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

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setCurrentPage(1);
    };

    return (
        <div className={styles.container}>
            <h2>Manage Accounts</h2>
            <div className={styles.roleButtons}>
                {['Admin', 'Manager', 'Staff', 'User', 'All'].map(role => (
                    <button
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className={`${styles.button} ${selectedRole === role ? styles.selected : ''}`}
                    >
                        {role}
                    </button>
                ))}
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('userId')}>User ID</th>
                        <th onClick={() => requestSort('userName')}>Name</th>
                        <th onClick={() => requestSort('userEmail')}>Email</th>
                        <th onClick={() => requestSort('userPhone')}>Phone</th>
                        <th onClick={() => requestSort('userPoint')}>Points</th>
                        <th onClick={() => requestSort('userRole')}>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAccounts.length > 0 ? (
                        currentAccounts.map((account) => (
                            <tr key={account.userId}>
                                <td>{account.userId}</td>
                                <td>{account.userName}</td>
                                <td>{account.userEmail}</td>
                                <td>{account.userPhone}</td>
                                <td>{account.userPoint}</td>
                                <td>{getRoleName(account.userRole)}</td>
                                <td>
                                    <button onClick={() => handleEditClick(account)} title="Edit">
                                        <FaEdit color="black" size={20} />
                                    </button>
                                    <button onClick={() => handleDeleteRequest(account.userId)} title="Delete">
                                        <FaTrash color="red" size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No accounts available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
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
                >
                    &gt;
                </button>
            </div>

            {editedAccountId && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <h3>Edit Account</h3>
                        <label>Name:</label>
                        <input value={userName} onChange={(e) => setUserName(e.target.value)} />
                        <label>Email:</label>
                        <input value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                        <label>Password:</label>
                        <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                        <label>Phone:</label>
                        <input value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
                        <label>Points:</label>
                        <input value={userPoint} onChange={(e) => setUserPoint(e.target.value)} />
                        <label>Role:</label>
                        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                            <option value="1">Admin</option>
                            <option value="2">Manager</option>
                            <option value="3">Staff</option>
                            <option value="4">User</option>
                        </select>
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={resetForm}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Modal for delete confirmation */}
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
