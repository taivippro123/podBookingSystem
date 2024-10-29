import React, { useEffect, useState } from 'react';
import styles from './ManageAccounts.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Component cho thông báo thành công
const SuccessPopup = ({ message, onClose }) => {
    return (
        <div className={styles.successPopupOverlay}>
            <div className={styles.successPopup}>
                <h2>Success</h2>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

const ManageAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userRole, setUserRole] = useState('');
    const [editingAccountId, setEditingAccountId] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Trạng thái cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 5;

    // Trạng thái cho loại người dùng được chọn
    const [filterRole, setFilterRole] = useState(''); // "" để hiện tất cả, "3" cho Staff, "4" cho User

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await fetch('http://localhost:5000/manage/accounts');
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const validateInputs = () => {
        let isValid = true;

        if (!userName) {
            setErrorMessage('Please enter a user name.');
            isValid = false;
        } else if (!userEmail.includes('@')) {
            setErrorMessage('Please enter a valid email address containing @.');
            isValid = false;
        } else if (!/^\d{1,10}$/.test(userPhone)) {
            setErrorMessage('Phone number must be numeric and up to 10 digits.');
            isValid = false;
        } else if (!userRole) {
            setErrorMessage('Please select a role.');
            isValid = false;
        } else {
            setErrorMessage('');
        }

        return isValid;
    };

    const handleAddAccount = async () => {
        if (!validateInputs()) return;

        const newAccount = {
            userName,
            userEmail,
            userPassword: 'defaultPassword',
            userPhone,
            userRole: parseInt(userRole),
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
                await fetchAccounts();
                setSuccessMessage('Account added successfully!');
                closePopup();

                setTimeout(() => {
                    setSuccessMessage('');
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error adding account: ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error adding account:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    const handleEditAccount = (account) => {
        setUserName(account.userName);
        setUserEmail(account.userEmail);
        setUserPhone(account.userPhone);
        setUserRole(account.userRole.toString());
        setEditingAccountId(account.userId);
        setIsPopupOpen(true);
        setErrorMessage('');
    };

    const handleUpdateAccount = async () => {
        if (!validateInputs()) return;

        const updatedAccount = {
            userName,
            userEmail,
            userPhone,
            userRole: parseInt(userRole),
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
                await fetchAccounts();
                setSuccessMessage('Account updated successfully!');
                closePopup();

                setTimeout(() => {
                    setSuccessMessage('');
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error updating account: ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error updating account:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    const handleConfirmDelete = (accountId) => {
        setAccountToDelete(accountId);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteAccount = async () => {
        if (!accountToDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/manage/accounts/${accountToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchAccounts();
                setSuccessMessage('Account deleted successfully!');
                setIsDeleteConfirmOpen(false);
                setAccountToDelete(null);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error deleting account: ${errorData.message || 'Please try again.'}`);
                setIsDeleteConfirmOpen(false);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const closePopup = () => {
        setUserName('');
        setUserEmail('');
        setUserPhone('');
        setUserRole('');
        setEditingAccountId(null);
        setIsPopupOpen(false);
        setErrorMessage('');
    };

    // Tính toán số lượng tài khoản trên mỗi trang
    const indexOfLastAccount = currentPage * accountsPerPage;
    const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;

    // Lọc tài khoản dựa trên vai trò
    const filteredAccounts = filterRole ? accounts.filter(account => account.userRole.toString() === filterRole) : accounts;

    const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

    // Chuyển trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

    return (
        <div className={styles.container}>
            <h1>Manage Accounts</h1>

            {/* Nút lọc vai trò nằm bên phải */}
            <div className={styles.roleFilter}>
                <button onClick={() => setFilterRole('')}>All</button>
                <button onClick={() => setFilterRole('3')}>Staff</button>
                <button onClick={() => setFilterRole('4')}>User</button>
            </div>

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
                    {currentAccounts.map((account) => (
                        <tr key={account.userId}>
                            <td>{account.userName}</td>
                            <td>{account.userEmail}</td>
                            <td>{account.userPhone}</td>
                            <td>{account.userRole === 3 ? 'Staff' : 'User'}</td>
                            <td className={styles.actions}>
                                <button onClick={() => handleEditAccount(account)}>
                                    <FaEdit color="black" size={30} />
                                </button>
                                <button onClick={() => handleConfirmDelete(account.userId)}>
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
                        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                        <input
                            type="text"
                            placeholder="User Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                        />
                        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                            <option value="">Select Role</option>
                            <option value="3">Staff</option>
                            <option value="4">User</option>
                        </select>
                        <button onClick={editingAccountId ? handleUpdateAccount : handleAddAccount}>
                            {editingAccountId ? 'Update Account' : 'Add Account'}
                        </button>
                        <button onClick={closePopup}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Xác nhận xóa tài khoản */}
            {isDeleteConfirmOpen && (
                <div className={styles.deleteConfirmOverlay}>
                    <div className={styles.deleteConfirm}>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this account?</p>
                        <button onClick={handleDeleteAccount}>Yes, Delete</button>
                        <button onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</button>
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

            {/* Thông báo thành công */}
            {successMessage && (
                <SuccessPopup message={successMessage} onClose={() => setSuccessMessage('')} />
            )}

            <button className={styles.addAccountButton} onClick={() => setIsPopupOpen(true)}>
                +
            </button>
        </div>
    );
};

export default ManageAccounts;
