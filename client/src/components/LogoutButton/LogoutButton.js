import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from "react-icons/md"; // Sử dụng icon logout mới
import './LogoutButton.css'; // Import CSS đã thêm cho nút Log Out

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa các dữ liệu liên quan đến phiên đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Điều hướng về trang Home
    navigate('/');
  };

  return (
    <button className="logoutButton" onClick={handleLogout}>
      <MdOutlineLogout className="logoutIcon" />
      Log Out
    </button>
  );
};

export default LogoutButton;
