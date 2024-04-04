

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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


const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/contact', element: <Contact /> },
  { path: '/login', element: <SignInForm /> },
  { path: '/appointment', element: <AppointmentPage /> },
  { path: '/track-appointment', element: <TrackAppointment /> },
  { path: '/doctors', element: <SearchDoctor /> },
  { path: '/dashboard/:clientId', element: <Dashboard /> },
  { path: '/dashboard/prescription/:clientId', element: <Prescription /> },
  { path: '/dashboard/prescription/:id', element: <PrescriptionView /> },
  { path: '/dashboard/change-password/:clientId', element: <ChangePassword /> },
  { path: '/dashboard/profile-setting/:clientId', element: <ProfileSetting /> },
]);

const AppRoutes = () => {
  
  return (
    <RouterProvider router={router} />
  );
}

export default AppRoutes;
