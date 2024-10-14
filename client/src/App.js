import React, { Profiler } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import AboutUs from './pages/AboutUs.jsx'
import Contact from './pages/Contact.jsx';
import Customer from './pages/Customer.js';
import StaffPage from './pages/Staff';
import AdminPage from './pages/Admin';
import ManagerPage from './pages/Manager';
import ProtectedRoute from './components/ProtectedRoute.js';
import RoomDetail from './components/RoomDetail.js';
import Booking from './components/Booking.js';
import Profile from './components/Profile.js';
import ViewBooking from './components/ViewBooking.js';
import Payment from './components/Payment.js';
import ManageRoom from './components/ManageRoom';
import Home from './pages/Home/Home.jsx';
import ComHeader from './components/ComHeader/ComHeader.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<ComHeader><Home /></ComHeader>} />
        <Route path="/login" element={<ComHeader><LoginPage /></ComHeader>} />
        <Route path="/signup" element={<ComHeader><Signup /></ComHeader>} />
        <Route path="/about" element={ <ComHeader><AboutUs /></ComHeader>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/room-detail/:id" element={<RoomDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/viewbookings/:userId" element={<ViewBooking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/rooms/:id" element={<ManageRoom />} />

        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={[4]}>
            <Customer />
          </ProtectedRoute>

        } />

        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={[3]}>
            <StaffPage />
          </ProtectedRoute>
        } />

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


      </Routes>

    </Router>
  );
}

export default App;
