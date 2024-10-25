import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import biểu tượng
import styles from './ManageAllAccounts.module.css';

const ManageAllAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [editedAccountId, setEditedAccountId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState(''); // Mới thêm
    const [userPhone, setUserPhone] = useState('');
    const [userPoint, setUserPoint] = useState('');
    const [userRole, setUserRole] = useState('');

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
        setUserPassword(''); // Đặt password rỗng khi chỉnh sửa
        setUserPhone(account.userPhone);
        setUserPoint(account.userPoint);
        setUserRole(account.userRole);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/admin/accounts/${editedAccountId}`, {
                userName,
                userEmail,
                userPassword, // Gửi password khi cập nhật
                userPhone,
                userPoint,
                userRole,
            });
            fetchAccounts(); // Refresh the account list
            resetForm();
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                await axios.delete(`http://localhost:5000/admin/accounts/${userId}`);
                fetchAccounts(); // Refresh the account list
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    const resetForm = () => {
        setEditedAccountId(null);
        setUserName('');
        setUserEmail('');
        setUserPassword(''); // Reset password
        setUserPhone('');
        setUserPoint('');
        setUserRole('');
    };

    // Hàm chuyển đổi role ID thành tên vai trò
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

    return (
        <div className={styles.container}>
            <h2>Manage Accounts</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Points</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.length > 0 ? (
                        accounts.map((account) => (
                            <tr key={account.userId}>
                                <td>{account.userId}</td>
                                <td>{account.userName}</td>
                                <td>{account.userEmail}</td>
                                <td>{account.userPhone}</td>
                                <td>{account.userPoint}</td>
                                <td>{getRoleName(account.userRole)}</td> {/* Sử dụng hàm getRoleName */}
                                <td>
                                    <button onClick={() => handleEditClick(account)} title="Edit">
                                        <FaEdit color="black" size={30} />
                                    </button>
                                    <button onClick={() => handleDelete(account.userId)} title="Delete">
                                        <FaTrash color="red" size={30} />
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
            {/* Modal for editing account */}
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
                        <input value={userRole} onChange={(e) => setUserRole(e.target.value)} />
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={resetForm}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAllAccounts;
