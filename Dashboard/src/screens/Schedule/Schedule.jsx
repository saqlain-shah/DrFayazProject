import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BiChevronLeft, BiChevronRight, BiPlus, BiTime } from 'react-icons/bi';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2'; // Corrected import
import AddAppointmentModal from './SchduleModel';
import { servicesData } from '../../components/Datas';

const fetchAppointmentData = async (token) => {
  try {
    const response = await fetch('http://localhost:8800/api/schedule', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.map(appointment => ({
      id: appointment._id,
      title: 'Appointment', // You can set a title for each appointment
      start: new Date(appointment.startDateTime),
      end: new Date(appointment.endDateTime),
    }));
  } catch (error) {
    throw new Error('Failed to fetch appointment data: ' + error.message);
  }
};

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [open, setOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await fetchAppointmentData(token);
      setAppointmentData(data);
    } catch (error) {
      console.error('Error fetching appointment data:', error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  return (
    <Layout>
      {open && (
        <AddAppointmentModal
          appointmentData={selectedEvent}
          isOpen={open}
          closeModal={() => setOpen(false)}
        />
      )}
      <button
        onClick={() => setOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
      {/* Utilizing unused icons */}
      <div className="flex justify-end mt-4 mr-4">
        <HiOutlineCalendarDays className="text-xl cursor-pointer mx-2" title="View Day" />
        <HiOutlineViewGrid className="text-xl cursor-pointer mx-2" title="View Week" />
        <BiTime className="text-xl cursor-pointer mx-2" title="View Time" />
      </div>
      <Calendar
        localizer={localizer}
        events={appointmentData}
        onSelectEvent={handleEventClick}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }} // Set the height of the calendar
      />
    </Layout>
  );
}

export default Schedule;
