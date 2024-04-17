import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BiChevronLeft, BiChevronRight, BiPlus } from 'react-icons/bi';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import AddAppointmentModal from './SchduleModel';

const CustomToolbar = (toolbar) => {
  // today button handler
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate('prev');
  };

  // next button handler
  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate('next');
  };

  // today button handler
  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  // month button handler
  const goToMonth = () => {
    toolbar.onView('month');
  };

  // week button handler
  const goToWeek = () => {
    toolbar.onView('week');
  };

  // day button handler
  const goToDay = () => {
    toolbar.onView('day');
  };

  // view button group
  const viewNamesGroup = [
    { view: 'month', label: 'Month' },
    { view: 'week', label: 'Week' },
    { view: 'day', label: 'Day' },
  ];

  return (
    <div className="flex flex-col gap-8 mb-8">
      <h1 className="text-xl font-semibold">Schedule</h1>
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
        <div className="md:col-span-2 grid grid-cols-3 rounded-md border border-subMain">
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
              className={`border-l text-xl py-2 flex-colo border-subMain ${
                toolbar.view === item.view
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

function Schedule() {
  const localizer = momentLocalizer(moment);
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAppointment = (response) => {
    const newAppointment = {
      id: response._id, // Use the _id from the response as the id for the appointment
      title: 'New Appointment', // You can set a default title or customize it based on your data
      start: new Date(response.startDateTime),
      end: new Date(response.endDateTime),
    };
    setAppointments([...appointments, newAppointment]);
    closeModal();
    
    // Automatically delete the appointment after a certain time period (e.g., 24 hours)
    setTimeout(() => {
      setAppointments(prevAppointments =>
        prevAppointments.filter(appointment => appointment.id !== response._id)
      );
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  };

  return (
    <Layout>
      {isModalOpen && (
        <AddAppointmentModal
          closeModal={closeModal}
          isOpen={isModalOpen}
          onSave={handleSaveAppointment}
        />
      )}

      {/* Calendar */}
      <button
        onClick={openModal}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: 900,
          marginBottom: 50,
        }}
        defaultDate={new Date()}
        timeslots={1}
        resizable
        step={60}
        selectable={true}
        views={['month', 'day', 'week']}
        components={{ toolbar: CustomToolbar }}
      />
    </Layout>
  );
}

export default Schedule;
