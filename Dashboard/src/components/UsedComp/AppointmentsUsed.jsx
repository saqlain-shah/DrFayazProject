import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppointmentTable } from '../Tables';
import AddAppointmentModal from '../Modals/AddApointmentModal';
import { BiPlus } from 'react-icons/bi';
import { RiDeleteBin6Line, RiEditLine } from 'react-icons/ri'; // Add RiEditLine icon
import { Button } from '../Form';
import { toast } from 'react-hot-toast';

function AppointmentsUsed({ doctor, token }) {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, [token]);

  const handleNewAppointment = (appointment) => {
    console.log('New appointment created:', appointment);
    const updatedAppointments = appointments.map(appt => appt.id === appointment.id ? appointment : appt);
    setAppointments(updatedAppointments);
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

  const handleEdit = (appointment) => {
    setOpen(true);
    setNewAppointment(appointment);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8800/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setAppointments(appointments.filter(appointment => appointment._id !== id));
        toast.success('Appointment deleted successfully!', {
          position: 'bottom-right',
        });
      } else {
        console.error('Failed to delete appointment');
        toast.error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Error deleting appointment');
    }
  };

  return (
    <div className="w-full">
      {open && (
        <AddAppointmentModal
          datas={newAppointment}
          isOpen={open}
          closeModal={() => handleClose()}
          handleNewAppointment={handleNewAppointment}
          isEditing={!!newAppointment}
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
          doctor={doctor}
          newAppointment={newAppointment}
          functions={{
            preview: handleEventClick,
            edit: handleEdit, // Pass the edit function as a prop
          }}
          token={token}
        />
      </div>
    </div>
  );
}

export default AppointmentsUsed;
