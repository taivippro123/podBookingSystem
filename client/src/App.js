import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.js';
import Signup from './pages/Signup/SignupPage.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Contact from './pages/Contact.jsx';
import Customer from './pages/Customer.js';
import StaffPage from './pages/Staff/Staff.js';
import AdminPage from './pages/Admin/AdminPages/Admin.js';
import ManageAllAccounts from './pages/Admin/ManageAccounts/ManageAllAccount.js';
import Manager from './pages/Manager/Manager.js';
import ManageServices from './pages/Manager/ManageServices.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Booking from './components/Booking.js';
import Profile from './components/Profile.js';
import ViewBooking from './components/ViewBooking.js';
import Payment from './components/Payment.js';
import ManageRoom from './components/ManageRoom';
import Home from './pages/Home/Home.jsx';
import ComHeader from './components/ComHeader/ComHeader.jsx';
import ComHeaderCostomer from './components/ComHeaderCustomer/ComheaderCustome.jsx';

import LoginPage from './pages/Login/LoginPage.jsx';
import ListRoom from './pages/ListRoom/ListRoom.jsx';
import RoomDetail from './pages/RoomDetail/RoomDetail.jsx';
import UpcomingBookings from './pages/Staff/UpcomingBookings';
import UpcomingServices from './pages/Staff/UpcomingServices';
import ManageRooms from './pages/Manager/ManageRooms.js';
import sidenav from './components/sidenav/sidenav.jsx';
import ManageSlots from './pages/Manager/ManageSlots.js';
import ManageAccounts from './pages/Manager/ManageAccounts.js';
import ManageBookings from './pages/Manager/ManageBookings.js';
import ViewTransactions from './pages/Admin/ViewTransactions/ViewTransactions.js';
import ViewNumberAccounts from './pages/Admin/ViewNumberAccounts/ViewNumberAccounts.js';
import ViewPopularRooms from './pages/Admin/ViewPopularRooms/ViewPopularRooms.js';
import ViewPopularServices from './pages/Admin/ViewPopularServices/ViewPopularServices.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComHeaderCostomer><Home /></ComHeaderCostomer>} />
        <Route path="/login" element={<ComHeaderCostomer><LoginPage /></ComHeaderCostomer>} />
        <Route path="/rooms" element={<ComHeaderCostomer><ListRoom /></ComHeaderCostomer>} />
        <Route path="/room/:id" element={<ComHeaderCostomer><RoomDetail /></ComHeaderCostomer>} />
        <Route path="/signup" element={<ComHeaderCostomer><Signup /></ComHeaderCostomer>} />
        <Route path="/about" element={<ComHeaderCostomer><AboutUs /></ComHeaderCostomer>} />
        <Route path="/contact" element={<ComHeaderCostomer><Contact /></ComHeaderCostomer>} />
        {/* <Route path="/room-details/:id" element={<RoomDetail />} /> */}
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/profile/:userId" element={<ComHeaderCostomer><Profile /></ComHeaderCostomer>} />
        <Route path="/viewbookings/:userId" element={ <ComHeaderCostomer> <ViewBooking /> </ComHeaderCostomer>} />
        <Route path="/payment" element={ <ComHeaderCostomer> <Payment /> </ComHeaderCostomer>} />
        <Route path="/rooms/:id" element={<ManageRoom />} />  
        <Route path="/login2" element={ <ComHeaderCostomer> <Login /> </ComHeaderCostomer>} />

         {/* Customer Protected Routes */}
         <Route path="/customer" element={
          <ProtectedRoute allowedRoles={[4]}>
            <ComHeaderCostomer><Customer /></ComHeaderCostomer>
          </ProtectedRoute>
        }>
          <Route path="/customer/room/:id" element={
            <ProtectedRoute allowedRoles={[4]}>
              <ComHeaderCostomer><RoomDetail /></ComHeaderCostomer>
            </ProtectedRoute>
          } />
        </Route>



        {/* Đường dẫn cho Staff */}
        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={[3]}>
            <StaffPage />
          </ProtectedRoute>
        }>
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

        {/* Đường dẫn cho Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminPage />
          </ProtectedRoute>
        }>
          <Route path="accounts" element={
            <ProtectedRoute allowedRoles={[1]}>
              <ManageAllAccounts />
            </ProtectedRoute>
          } />
          <Route path="transactions" element={
            <ProtectedRoute allowedRoles={[1]}>
              <ViewTransactions />
            </ProtectedRoute>
          } />
          <Route path="number-accounts" element={
            <ProtectedRoute allowedRoles={[1]}>
              <ViewNumberAccounts />
            </ProtectedRoute>
          } />
          <Route path="popular-rooms" element={
            <ProtectedRoute allowedRoles={[1]}>
              <ViewPopularRooms />
            </ProtectedRoute>
          } />
          <Route path="popular-services" element={
            <ProtectedRoute allowedRoles={[1]}>
              <ViewPopularServices />
            </ProtectedRoute>
          } /> {/* Đường dẫn mới cho ViewPopularServices */}
        </Route>

        {/* Đường dẫn cho Manager */}
        <Route path="/manager" element={
          <ProtectedRoute allowedRoles={[2]}>
            <Manager />
          </ProtectedRoute>
        }>
          <Route path="manageRooms" element={
            <ProtectedRoute allowedRoles={[2]}>
              <ManageRooms />
            </ProtectedRoute>
          } />
          <Route path="manageSlots" element={
            <ProtectedRoute allowedRoles={[2]}>
              <ManageSlots />
            </ProtectedRoute>
          } />
          <Route path="manageServices" element={
            <ProtectedRoute allowedRoles={[2]}>
              <ManageServices />
            </ProtectedRoute>
          } />
          <Route path="manageAccounts" element={
            <ProtectedRoute allowedRoles={[2]}>
              <ManageAccounts />
            </ProtectedRoute>
          } />
          <Route path="manageBookings" element={
            <ProtectedRoute allowedRoles={[2]}>
              <ManageBookings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;