import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import AboutUs from './pages/AboutUs.jsx';
import Contact from './pages/Contact.jsx';
import Customer from './pages/Customer.js';
import StaffPage from './pages/Staff/Staff.js'; // Giả định đây là nơi chứa Staff và các route con
import AdminPage from './pages/Admin';
import ManagerPage from './pages/Manager/Manager.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Booking from './components/Booking.js';
import Profile from './components/Profile.js';
import ViewBooking from './components/ViewBooking.js';
import Payment from './components/Payment.js';
import ManageRoom from './components/ManageRoom';
import Home from './pages/Home/Home.jsx';
import ComHeader from './components/ComHeader/ComHeader.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import ListRoom from './pages/ListRoom/ListRoom.jsx';
import RoomDetail from './pages/RoomDetail/RoomDetail.jsx';

import UpcomingBookings from './pages/Staff/UpcomingBookings';
import UpcomingServices from './pages/Staff/UpcomingServices'; // Đường dẫn tới UpcomingServices
import ManageRooms from './pages/Manager/ManageRooms.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComHeader><Home /></ComHeader>} />
        <Route path="/login" element={<ComHeader><LoginPage /></ComHeader>} />
        <Route path="/rooms" element={<ComHeader><ListRoom /></ComHeader>} />
        <Route path="/room/:id" element={<ComHeader><RoomDetail /></ComHeader>} />
        <Route path="/signup" element={<ComHeader><Signup /></ComHeader>} />
        <Route path="/about" element={<ComHeader><AboutUs /></ComHeader>} />
        <Route path="/contact" element={<ComHeader><Contact /></ComHeader>} />
        <Route path="/room-details/:id" element={<RoomDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/viewbookings/:userId" element={<ViewBooking />} />
        <Route path="/payment" element={<ComHeader><Payment /></ComHeader>} />
        <Route path="/rooms/:id" element={<ManageRoom />} />
        <Route path="/login2" element={<Login />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        {/* <Route path="/booking-success" element={<BookingSuccess />} /> */}
        <Route path="/staff" element={<ComHeader><Staff /></ComHeader>} />



        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={[4]}>
            <Customer />
          </ProtectedRoute>
        } />

        {/* <Route path="/staff" element={
          <ProtectedRoute allowedRoles={[3]}>
          
            <StaffPage /> {/* Hiển thị thanh menu và header cho Staff */}
          </ProtectedRoute>
        }>
          {/* Các route con cho Staff */}
          <Route path="upcoming-bookings" element={
            <ProtectedRoute allowedRoles={[3]}>
              <UpcomingBookings />
            </ProtectedRoute>
          } />
          <Route path="upcoming-services" element={
            <ProtectedRoute allowedRoles={[3]}>
              <UpcomingServices />
            </ProtectedRoute>
          } />
        </Route>


        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminPage />
          </ProtectedRoute>
        } />

        <Route path="/manager" element={
          <ProtectedRoute allowedRoles={[2]}>
            <ManagerPage />
          </ProtectedRoute>
        } />

        <Route path="/manager/manageRooms" element={
          <ProtectedRoute allowedRoles={[2]}>
            <ManageRooms /> {/* Thêm route cho ManageRooms */}
          </ProtectedRoute>
        } />


      </Routes>
    </Router>
  );
}

export default App;
