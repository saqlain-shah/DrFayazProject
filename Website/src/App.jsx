import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate from react-router-dom
import { AuthProvider, useAuth } from './AuthContext';
import Home from './components/Home/Home/Home';
import SignInForm from './components/Login/SignInForm';
import Contact from './components/Contact/Contact';
import AppointmentPage from './components/Appointment/AppointmentPage';
import TrackAppointment from './components/TrackAppointment/TrackAppointment';
import SearchDoctor from './components/Doctor/SearchDoctor/SearchDoctor';
import Dashboard from './components/Doctor/Dashboard/Dashboard';
import Prescription from './components/Doctor/Prescription/Prescription';
import PrescriptionView from './components/Doctor/Prescription/PrescriptionView';
import ChangePassword from './components/Doctor/ChangePassword/ChangePassword';
import ProfileSetting from './components/Doctor/ProfileSetting/ProfileSetting';
import PrivateRoute from './Private';
import { ToastContainer } from 'react-toastify';
import Success from './StripeSuccess/Success';
import Cancel from './StripeSuccess/Cancel';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<SignInForm />} />

      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/appointment" element={<AppointmentPage />} />
      <Route path="/track-appointment" element={<TrackAppointment />} />
      <Route path="/doctors" element={<SearchDoctor />} />
      <Route path="/dashboard/:clientId" element={<Dashboard />} />
      <Route path="/dashboard/prescription/:id" element={<Prescription />} />
      <Route path="/dashboard/prescription/:id" element={<PrescriptionView />} />
      <Route path="/dashboard/profile-setting/:clientId" element={<ProfileSetting />} />
      <Route path="/dashboard/change-password/:clientId" element={<ChangePassword />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
