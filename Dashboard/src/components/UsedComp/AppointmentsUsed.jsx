import React, { useState, useEffect } from 'react';
// import { AppointmentTable } from '../Tables';
import { useNavigate } from 'react-router-dom';
import AddAppointmentModal from '../Modals/AddApointmentModal';
import EditAppointmentModal from '../Modals/EditAppointment';
import { BiPlus } from 'react-icons/bi';
import { toast } from 'react-hot-toast';

function AppointmentsUsed({ token }) {
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://server-yvzt.onrender.com/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenEditModal(true);
  };

  const handleNewAppointment = (appointment) => {
    setAppointments(prevAppointments => [...prevAppointments, appointment]);
  };

  const handleUpdateAppointment = (updatedAppointment) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment._id === updatedAppointment._id ? updatedAppointment : appointment
      )
    );

    setTimeout(() => {
      setAppointments(prevAppointments => [...prevAppointments]);
    }, 100);
  };

  const handleCloseModals = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
    setSelectedAppointment(null);
  };

  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
  };

  return (
    <div className="w-full">
      {openAddModal && (
        <AddAppointmentModal
          isOpen={openAddModal}
          closeModal={handleCloseModals}
          handleNewAppointment={handleNewAppointment}
        />
      )}
      {openEditModal && selectedAppointment && (
        <EditAppointmentModal
          isOpen={openEditModal}
          closeModal={handleEditModalClose}
          appointment={selectedAppointment}
          onUpdateAppointment={handleUpdateAppointment}
        />
      )}
      <h1 className="text-sm font-medium mb-6">Appointments</h1>
      <div className="w-full overflow-x-scroll">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddModalOpen}
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
          token={token}
          appointments={appointments}
        />
      </div>
    </div>
  );
}

export default AppointmentsUsed;
