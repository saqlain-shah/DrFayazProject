import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppointmentTable } from '../Tables';
import AddAppointmentModal from '../Modals/AddApointmentModal';
import EditAppointmentModal from '../Modals/EditAppointment';
import { BiPlus } from 'react-icons/bi';
import { toast } from 'react-hot-toast';

function AppointmentsUsed({ token, patientId }) {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenEditModal(true);
  };

  const handleNewAppointment = (appointment) => {
    console.log('New appointment created:', appointment);
    setAppointments(prevAppointments => [...prevAppointments, appointment]);
  };

  const handleUpdateAppointment = (updatedAppointment) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment._id === updatedAppointment._id ? updatedAppointment : appointment
      )
    );

    // Add a trigger to update the state again after a short delay
    setTimeout(() => {
      setAppointments(prevAppointments => [...prevAppointments]);
    }, 100); // Adjust the delay time as needed
  };


  const handleCloseModals = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="w-full">
      {openAddModal && (
        <AddAppointmentModal
          isOpen={openAddModal}
          closeModal={handleCloseModals}
          handleNewAppointment={handleNewAppointment}
          patientId={patientId}
        />
      )}
      {openEditModal && selectedAppointment && (
        <EditAppointmentModal
          isOpen={openEditModal}
          closeModal={() => setOpenEditModal(false)}
          appointment={selectedAppointment}
          onUpdateAppointment={handleUpdateAppointment} // Pass the onUpdateAppointment function
        />
      )}
      <h1 className="text-sm font-medium mb-6">Appointment</h1>
      <div className="w-full overflow-x-scroll">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setOpenAddModal(true)}
            className="bg-main text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-main-dark transition duration-300 flex items-center"
          >
            <BiPlus className="mr-2" />
            Add Appointment
          </button>
        </div>
        <AppointmentTable
          functions={{
            edit: handleEdit,
          }}
          onEdit={handleEdit}
          token={token}
          patientId={patientId}
        />
      </div>
    </div>
  );
}

export default AppointmentsUsed;
