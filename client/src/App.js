import React, { Profiler } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import AboutUs from './pages/AboutUs.js'
import Contact from './pages/Contact.js';
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
function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/room-detail/:id" element={<RoomDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/viewbookings" element={<ViewBooking />} />
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
