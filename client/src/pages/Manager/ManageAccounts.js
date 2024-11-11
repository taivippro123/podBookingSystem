import React, { useEffect, useState } from 'react';
import styles from './ManageAccounts.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { Modal, notification, Input } from 'antd';

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
    
    const [errorMessage, setErrorMessage] = useState('');
    
    // Trạng thái cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 5;

    // Trạng thái cho loại người dùng được chọn
    const [filterRole, setFilterRole] = useState('');
    
    // Trạng thái cho tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

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
                notification.success({
                    message: 'Success',
                    description: 'Account added successfully!',
                });
                closePopup();
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error adding account: ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error adding account:', error);
            notification.error({
                message: 'Error',
                description: 'An unexpected error occurred. Please try again.',
            });
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
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
                notification.success({
                    message: 'Success',
                    description: 'Account updated successfully!',
                });
                closePopup();
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error updating account: ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error updating account:', error);
            notification.error({
                message: 'Error',
                description: 'An unexpected error occurred. Please try again.',
            });
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
                notification.success({
                    message: 'Success',
                    description: 'Account deleted successfully!',
                });
                setIsDeleteConfirmOpen(false);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error deleting account: ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            notification.error({
                message: 'Error',
                description: 'An unexpected error occurred. Please try again.',
            });
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

    // Lọc tài khoản dựa trên vai trò và tìm kiếm theo tên/email/phone
    const filteredAccounts = accounts.filter(account => {
        return (
            (filterRole ? account.userRole?.toString() === filterRole : true) &&
            (
                account.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                account.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                account.userPhone?.includes(searchTerm) ||
                account.userId?.toString().includes(searchTerm)
            )
        );
    });
    

    const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

    // Chuyển trang
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

    return (
        <div className={styles.container}>
            <h1 className={styles.headerTitle}>MANAGE ACCOUNTS</h1>

            {/* Nút lọc vai trò nằm bên phải */}
            <div className={styles.roleFilter}>
                <button onClick={() => setFilterRole('')}>All</button>
                <button onClick={() => setFilterRole('3')}>Staff</button>
                <button onClick={() => setFilterRole('4')}>User</button>
            </div>

            <div className={styles.search}>
                <Input
                    placeholder="Search by ID, Name, Email, or Phone"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    allowClear
                />
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>User ID</th>
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
                            <td>{account.userId}</td>
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
                        
                        <h2>Are you sure you want to delete this account?</h2>
                        <button onClick={handleDeleteAccount} className={styles.confirmDeleteButton}>Yes</button>
                        <button onClick={() => setIsDeleteConfirmOpen(false)} className={styles.cancelDeleteButton}>No</button>
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

            

            <button className={styles.addAccountButton} onClick={() => setIsPopupOpen(true)}>
            <FaPlus size={30} color="white" />
            </button>
        </div>
    );
};

export default ManageAccounts;
