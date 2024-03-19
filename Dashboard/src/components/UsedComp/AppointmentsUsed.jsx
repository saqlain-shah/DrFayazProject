import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppointmentTable } from '../Tables';
import AddAppointmentModal from '../Modals/AddApointmentModal';
import { BiPlus } from 'react-icons/bi';
import { toast } from 'react-hot-toast';

function AppointmentsUsed({ token, patientId }) {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState(null);
  useEffect(() => {
    console.log('Fetching appointments for patientId:', patientId);
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/appointments/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        toast.error('Failed to fetch appointments');
      }
    };


    fetchAppointments();
  }, [patientId, token]);


  const handleNewAppointment = (appointment) => {
    console.log('New appointment created:', appointment);
    setAppointments(prevAppointments => [...prevAppointments, appointment]);
    setNewAppointment(appointment);
  };

  const handleEventClick = (event) => {
    console.log('Appointment clicked:', event);
    setOpen(true);
    setNewAppointment(event);
  };

  const handleClose = () => {
    console.log('Modal closed');
    setOpen(false);
    setNewAppointment(null);
  };

  return (
    <div className="w-full">
      {open && (
        <AddAppointmentModal
          datas={newAppointment}
          isOpen={open}
          closeModal={() => handleClose()}
          handleNewAppointment={handleNewAppointment}
          patientId={patientId}
        />
      )}
      <h1 className="text-sm font-medium mb-6">Appointment</h1>
      <div className="w-full overflow-x-scroll">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setOpen(true)}
            className="bg-main text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-main-dark transition duration-300 flex items-center"
          >
            <BiPlus className="mr-2" />
            Add Appointment
          </button>
        </div>
        <AppointmentTable
          data={appointments}
          newAppointment={newAppointment}
          functions={{
            preview: handleEventClick,
          }}
          token={token}
          patientId={patientId}
        />
      </div>
    </div>
  );
}

export default AppointmentsUsed;
