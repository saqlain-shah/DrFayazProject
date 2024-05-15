import React, { useEffect } from 'react';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import AppointmentPage from '../../Appointment/AppointmentPage';

const Dashboard = () => {
    const { role } = useAuthCheck();
    const clientId = localStorage.getItem('clientId'); // Retrieve clientId from local storage

    useEffect(() => {
     
        // Check for changes in clientId
    }, [clientId]);

    return (
        <DashboardLayout >
            <div className="row">
                <div className="col-md-12 rounded" style={{ background: '#f8f9fa' }}>
                <h5 className="text-title" style={{ marginTop: '20px' }}>Appointments</h5>
                    <AppointmentPage/>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
