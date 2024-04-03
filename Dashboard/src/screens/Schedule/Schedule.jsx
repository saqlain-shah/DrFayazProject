import React, { useState, useEffect } from 'react';
import { BiTime } from 'react-icons/bi';
import Layout from '../../Layout'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BiChevronLeft, BiChevronRight, BiPlus } from 'react-icons/bi';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import AppointmentDetailsModal from '../../components/Modals/fetchModel';
import { toast } from 'react-hot-toast';
import AddAppointmentModal from './SchduleModel';

const CustomToolbar = (toolbar) => {
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

const Schedule = () => {
  const localizer = momentLocalizer(moment);
  const [open, setOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Simulating API call to fetch schedule data
      // Replace this with your actual fetch logic
      const data = [
        {
          id: 1,
          title: 'Appointment 1',
          start: new Date(),
          end: new Date(),
        },
        {
          id: 2,
          title: 'Appointment 2',
          start: new Date(),
          end: new Date(),
        },
      ];
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
        <AppointmentDetailsModal
          isOpen={open}
          closeModal={() => setOpen(false)}
          event={selectedEvent}
        />
      )}
      <button
        onClick={() => setOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
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
        style={{ height: 500 }}
      />
    </Layout>
  );
};

export default Schedule;
