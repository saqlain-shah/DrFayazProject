import 'tailwindcss/tailwind.css';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Aos from 'aos';
import Dashboard from './screens/Dashboard';
import Toast from './components/Notifications/Toast';
import Payments from './screens/Payments/Payments';
import Appointments from './screens/Appointments';
import Patients from './screens/Patients/Patients';
import Campaings from './screens/Campaings';
import Services from './screens/Services';
import Invoices from './screens/Invoices/Invoices';
import Settings from './screens/Settings';
import CreateInvoice from './screens/Invoices/CreateInvoice';
import EditInvoice from './screens/Invoices/EditInvoice';
import PreviewInvoice from './screens/Invoices/PreviewInvoice';
import EditPayment from './screens/Payments/EditPayment';

import PreviewPayment from './screens/Payments/PreviewPayment';
import Medicine from './screens/Medicine';
import PatientProfile from './screens/Patients/PatientProfile';
import CreatePatient from './screens/Patients/CreatePatient';
import Doctors from './screens/Doctors/Doctors';
import DoctorProfile from './screens/Doctors/DoctorProfile';
import Receptions from './screens/Receptions';
import NewMedicalRecode from './screens/Patients/NewMedicalRecode';
import NotFound from './screens/NotFound';
import Login from './screens/Login';
import Register from './screens/Register';
import Schedule from './screens/Schedule/Schedule';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import Webpatinet from './screens/Patients/Webpatinet';
import { NotificationProvider } from './components/NotificationContext';
import { ToastContainer } from 'react-toastify'; 
import Users from './screens/Users/Users';

function PrivateRoute({ element, ...props }) {
  const { user } = useAuth();

  return user ? element : <Navigate to="/login" replace />;
}

function App() {
  const { user } = useAuth();
  Aos.init();

  return (
    <>
      <Toast />
      <ToastContainer /> 
      <BrowserRouter>
      <NotificationProvider>
        <Routes>
          {user && <Route path="/login" element={<Navigate to="/" replace />} />}
          {!user && <Route path="/login" element={<Login />} />}
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/invoices" element={<PrivateRoute element={<Invoices />} />} />
          <Route path="/invoices/create" element={<PrivateRoute element={<CreateInvoice />} />} />
          <Route path="/invoices/edit/:id" element={<PrivateRoute element={<EditInvoice />} />} />
          <Route path="/invoices/preview/:id" element={<PrivateRoute element={<PreviewInvoice />} />} />
          <Route path="/payments" element={<PrivateRoute element={<Payments />} />} />
          <Route path="/payments/edit/:id" element={<PrivateRoute element={<EditPayment />} />} />
          <Route path="/payments/preview/:id" element={<PrivateRoute element={<PreviewPayment />} />} />
          <Route path="/users" element={<PrivateRoute element={<Users />} />} />
          <Route path="/patients" element={<PrivateRoute element={<Patients />} />} />
          <Route path="/patients/preview/:id" element={<PrivateRoute element={<PatientProfile />} />} />
          <Route path="/patients/profile/:id" element={<PrivateRoute element={<PatientProfile />} />} />
          <Route path="/patients/create" element={<PrivateRoute element={<CreatePatient />} />} />
          <Route path="/patients/visiting/:id" element={<PrivateRoute element={<NewMedicalRecode />} />} />
          <Route path="/doctors" element={<PrivateRoute element={<Doctors />} />} />
          <Route path="/doctors/preview/:id" element={<PrivateRoute element={<DoctorProfile />} />} />
          <Route path="/schedule" element={<PrivateRoute element={<Schedule />} />} />
          <Route path="/receptions" element={<PrivateRoute element={<Receptions />} />} />
          <Route path="/appointments" element={<PrivateRoute element={<Appointments />} />} />
          <Route path="/campaigns" element={<PrivateRoute element={<Campaings />} />} />
          <Route path="/medicine" element={<PrivateRoute element={<Medicine />} />} />
          <Route path="/services" element={<PrivateRoute element={<Services />} />} />
          <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </NotificationProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
