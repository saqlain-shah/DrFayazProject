import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BiChevronLeft, BiChevronRight, BiPlus } from 'react-icons/bi';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AppointmentDetailsModal from './appointmentDetailModel';
import BASE_URL from '../baseUrl.jsx';

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate('prev');
  };
  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate('next');
  };
  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };
  const goToMonth = () => {
    toolbar.onView('month');
  };
  const goToWeek = () => {
    toolbar.onView('week');
  };
  const goToDay = () => {
    toolbar.onView('day');
  };
  const viewNamesGroup = [
    { view: 'month', label: 'Month' },
    { view: 'week', label: 'Week' },
    { view: 'day', label: 'Day' },
  ];

  return (
    <div className="flex flex-col gap-8 mb-8">
      <h1 className="text-xl font-semibold">Appointments</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-4">
        <div className="md:col-span-1 flex sm:justify-start justify-center items-center">
          <button
            onClick={goToCurrent}
            className="px-6 py-2 border border-subMain rounded-md text-subMain"
          >
            Today
          </button>
        </div>
        {/* label */}
        <div className="md:col-span-9 flex-rows gap-4">
          <button onClick={goToBack} className="text-2xl text-subMain">
            <BiChevronLeft />
          </button>
          <span className="text-xl font-semibold">
            {moment(toolbar.date).format('MMMM YYYY')}
          </span>
          <button onClick={goToNext} className="text-2xl text-subMain">
            <BiChevronRight />
          </button>
        </div>
        {/* filter */}
        <div className="md:col-span-2 grid grid-cols-3 rounded-md  border border-subMain">
          {viewNamesGroup.map((item, index) => (
            <button
              key={index}
              onClick={
                item.view === 'month'
                  ? goToMonth
                  : item.view === 'week'
                    ? goToWeek
                    : goToDay
              }
              className={`border-l text-xl py-2 flex-colo border-subMain ${toolbar.view === item.view
                ? 'bg-subMain text-white'
                : 'text-subMain'
                }`}
            >
              {item.view === 'month' ? (
                <HiOutlineViewGrid />
              ) : item.view === 'week' ? (
                <HiOutlineCalendarDays />
              ) : (
                <BiPlus />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

function Appointments({ events }) {
  const localizer = momentLocalizer(moment);
  const [appointments, setAppointments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/web/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Map the fetched appointments to the format expected by the Calendar component
        const formattedAppointments = response.data.map(appointment => ({
          id: appointment._id, // Assign unique ID to each appointment
          title: appointment.selectedService.name, // Use service name as title
          start: new Date(appointment.selectedSlot.startDateTime),
          end: new Date(appointment.selectedSlot.endDateTime),
          // Additional appointment details
          selectedService: appointment.selectedService, // Include selectedService
          patientInfo: appointment.patientInfo // Include patientInfo
          // You can include other details here if needed
        }));

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to fetch appointments. Please try again.');
      }
    };

    fetchAppointments();
  }, []);

  const onDelete = (eventId) => {
    // Implement the logic to delete the appointment with the given eventId
    console.log('Deleting event with ID:', eventId);
  };


  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <AppointmentDetailsModal
        isOpen={isModalOpen} // Use isOpen instead of isModalOpen
        closeModal={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: 900,
          marginBottom: 50,
        }}
        onSelectEvent={handleEventSelect}
        defaultDate={new Date()}
        timeslots={1}
        resizable
        step={60}
        selectable={true}
        eventPropGetter={(event) => {
          const style = {
            backgroundColor: event.color || '#66B5A3',
            borderRadius: '10px',
            color: 'white',
            border: '1px',
            borderColor: '#F2FAF8',
            fontSize: '12px',
            padding: '5px 5px',
          };
          return {
            style,
          };
        }}
        dayPropGetter={(date) => {
          const backgroundColor = 'white';
          const style = {
            backgroundColor,
          };
          return {
            style,
          };
        }}
        views={['month', 'day', 'week']}
        components={{ toolbar: CustomToolbar }}
      />
    </Layout>
  );
}

export default Appointments;
