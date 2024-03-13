import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BiChevronLeft, BiChevronRight, BiPlus, BiTime } from 'react-icons/bi';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import AddAppointmentModal from './SchduleModel';
import { servicesData } from '../../components/Datas';

// custom toolbar
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
                <BiTime />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// import React, { useState } from 'react';
// import Layout from '../../Layout';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import { BiPlus } from 'react-icons/bi';
// import AddAppointmentModal from './AddAppointmentModal';
// import { servicesData } from '../../components/Datas';
// import { fetchAppointmentData } from '../../api'; // import fetchAppointmentData function

function Schedule() {
  const localizer = momentLocalizer(moment);
  const [open, setOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch appointment data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch appointment data function
  const fetchData = async () => {
    try {
      const data = await fetchAppointmentData(); // Assuming you have a function to fetch appointment data
      setAppointmentData(data);
    } catch (error) {
      console.error('Error fetching appointment data:', error);
    }
  };

  // onClick event handler
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  return (
    <Layout>
      {open && (
        <AddAppointmentModal
          appointmentData={selectedEvent} // Pass selected event data as appointmentData prop
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
      <Calendar
        localizer={localizer}
        events={appointmentData} // Pass appointment data to the Calendar component
        // Your other Calendar props
        onSelectEvent={handleEventClick} // Handle event click
      />
    </Layout>
  );
}

export default Schedule;
