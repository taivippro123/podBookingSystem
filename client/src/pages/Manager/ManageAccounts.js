import React, { useEffect, useState } from 'react';
import styles from './ManageAccounts.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManageAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userRole, setUserRole] = useState('');
    const [editingAccountId, setEditingAccountId] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    // Fetch all accounts
    const fetchAccounts = async () => {
        try {
            const response = await fetch('http://localhost:5000/manage/accounts');
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    // Add a new account
    const handleAddAccount = async () => {
        if (!userName || !userEmail || !userPhone || !userRole) {
            alert('Please fill out all fields.');
            return;
        }

        const newAccount = {
            userName,
            userEmail,
            userPhone,
            userRole,
        };

        try {
            const response = await fetch('http://localhost:5000/manage/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAccount),
            });

            if (response.ok) {
                fetchAccounts();
                closePopup();
            } else {
                alert('Error adding account. Please try again.');
            }
        } catch (error) {
            console.error('Error adding account:', error);
        }
    };

    // Edit an account
    const handleEditAccount = (account) => {
        setUserName(account.userName);
        setUserEmail(account.userEmail);
        setUserPhone(account.userPhone);
        setUserRole(account.userRole);
        setEditingAccountId(account.userId);
        setIsPopupOpen(true);
    };

    // Update an account
    const handleUpdateAccount = async () => {
        if (!userName || !userEmail || !userPhone || !userRole) {
            alert('Please fill out all fields.');
            return;
        }

        const updatedAccount = {
            userName,
            userEmail,
            userPhone,
            userRole,
        };

        try {
            const response = await fetch(`http://localhost:5000/manage/accounts/${editingAccountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAccount),
            });

            if (response.ok) {
                fetchAccounts();
                closePopup();
            } else {
                alert('Error updating account. Please try again.');
            }
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    // Delete an account
    const handleDeleteAccount = async (accountId) => {
        if (!window.confirm('Are you sure you want to delete this account?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/manage/accounts/${accountId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchAccounts();
            } else {
                alert('Error deleting account. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    // Close popup form and clear fields
    const closePopup = () => {
        setUserName('');
        setUserEmail('');
        setUserPhone('');
        setUserRole('');
        setEditingAccountId(null);
        setIsPopupOpen(false);
    };

    return (
        <div className={styles.container}>
            <h1>Manage Accounts</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account) => (
                        <tr key={account.userId}>
                            <td>{account.userName}</td>
                            <td>{account.userEmail}</td>
                            <td>{account.userPhone}</td>
                            <td>{account.userRole === 3 ? 'Staff' : 'User'}</td>
                            <td className={styles.actions}>
                                <button onClick={() => handleEditAccount(account)}>
                                    <FaEdit color="black" size={30} />
                                </button>
                                <button onClick={() => handleDeleteAccount(account.userId)}>
                                    <FaTrash color="red" size={30} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Popup for adding or editing an account */}
            {isPopupOpen && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupForm}>
                        <h2>{editingAccountId ? 'Edit Account' : 'Add Account'}</h2>
                        <input
                            type="text"
                            placeholder="User Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="User Email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="User Phone"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                        />
                        <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="3">Staff</option>
                            <option value="4">User</option>
                        </select>
                        <button onClick={editingAccountId ? handleUpdateAccount : handleAddAccount}>
                            {editingAccountId ? 'Update Account' : 'Add Account'}
                        </button>
                        <button onClick={closePopup} className={styles.cancelButton}>Close</button>
                    </div>
                </div>
            )}

            {/* Add account button */}
            <button className={styles.addAccountButton} onClick={() => setIsPopupOpen(true)}>
                +
            </button>
        </div>
    );
};

export default ManageAccounts;
