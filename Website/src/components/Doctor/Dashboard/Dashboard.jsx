import React from 'react'
//import DoctorDashCard from './doctor/DoctorDashCard';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
//import DashboardPage from './doctor/DashboardPage';
//import PatientDashboard from './PatientDashboard';
import AppointmentPage from '../../Appointment/AppointmentPage';

const Dashboard = () => {
    const { role } = useAuthCheck();
    return (
        <>
            <DashboardLayout>

                <div className="row">
                        <div className="col-md-12 rounded" style={{ background: '#f8f9fa' }}>
                            <h5 className="text-title">Appointments</h5>
                            <AppointmentPage/>
                        </div>
                </div>
            </DashboardLayout>
        </>
    )
}

export default Dashboard;