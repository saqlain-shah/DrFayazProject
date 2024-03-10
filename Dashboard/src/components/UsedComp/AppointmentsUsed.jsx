import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppointmentTable } from '../Tables';
import AddAppointmentModal from '../Modals/AddApointmentModal';

function AppointmentsUsed({ doctor }) {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8800/api/appointments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNewAppointment = (appointment) => {
    console.log('New appointment created:', appointment); // Log the new appointment data
    const updatedAppointments = appointments.map(appt => appt.id === appointment.id ? appointment : appt);
    setAppointments(updatedAppointments);
    setNewAppointment(appointment);
  };

  // onClick event handler
  const handleEventClick = (event) => {
    console.log('Appointment clicked:', event); // Log the clicked appointment data
    setOpen(true);
    setNewAppointment(event);
  };

  // handle modal close
  const handleClose = () => {
    console.log('Modal closed');
    setOpen(false);
    setNewAppointment(null);
  };

  console.log('Appointments:', appointments);
  console.log('New appointment:', newAppointment);

  return (
    <div className="w-full">
      {open && (
        <AddAppointmentModal
          datas={newAppointment}
          isOpen={open}
          closeModal={() => handleClose()}
          handleNewAppointment={handleNewAppointment} // Pass the function to handle new appointment creation
        />
      )}
      <h1 className="text-sm font-medium mb-6">Appointment</h1>
      <div className="w-full overflow-x-scroll">
        <AppointmentTable
          data={appointments}
          doctor={doctor}
          newAppointment={newAppointment} // Pass the new appointment data to the AppointmentTable component
          functions={{
            preview: handleEventClick,
          }}
        />
      </div>
    </div>
  );
}

export default AppointmentsUsed;
