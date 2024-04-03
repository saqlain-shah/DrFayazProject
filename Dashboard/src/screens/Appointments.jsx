import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BiChevronLeft, BiChevronRight, BiPlus } from 'react-icons/bi';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import AddAppointmentModal from '../components/Modals/AddApointmentModal';
import axios from 'axios'; // Import Axios
import { toast } from 'react-hot-toast';

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
                <BiPlus />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

function Appointments() {
  const localizer = momentLocalizer(moment);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  useEffect(() => {
    // Make API call to fetch appointment data
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await axios.get('http://localhost:8800/api/v1', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        const eventData = response.data.data;
        const formattedEvents = eventData.map((event) => ({
          id: event._id,
          start: new Date(event.patientInfo.scheduleDate),
          end: new Date(event.patientInfo.scheduleTime),
          title: `${event.patientInfo.firstName} ${event.patientInfo.lastName}`,
          email: event.patientInfo.email, // Include email from response
          phone: event.patientInfo.phone, // Include phone from response
          paymentType: event.payment.paymentType, // Include paymentType from response
          paymentMethod: event.payment.paymentMethod, // Include paymentMethod from response
          // cardNumber: event.payment.cardNumber, // Include cardNumber from response
          // cardExpiredYear: event.payment.cardExpiredYear, // Include cardExpiredYear from response
          // cvv: event.payment.cvv, // Include cvv from response
          // expiredMonth: event.payment.expiredMonth, // Include expiredMonth from response
          // nameOnCard: event.payment.nameOnCard, // Include nameOnCard from response
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array to run the effect only once on component mount

  const handleClose = () => {
    setOpen(!open);
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      const response = await fetch(`http://localhost:8800/api/v1/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      const data = await response.json();
      if (response.ok) {
        // Filter out the deleted event from the events state
        const updatedEvents = events.filter((event) => event.id !== id);
        setEvents(updatedEvents); // Update the events state
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Set the selected event
    setOpen(true); // Open the modal
  };

  const handleNewAppointment = (newAppointment) => {
    // Ensure that the required fields are present
    if (newAppointment && newAppointment.start && newAppointment.end) {
      // Update the events state to include the new appointment
      setEvents([...events, newAppointment]);
    } else {
      console.error('Missing required fields in the appointment data.');
      toast.error('Failed to create appointment. Missing required fields.');
    }
  };



  return (
    <Layout>
      {open && (
        <AddAppointmentModal
          closeModal={() => setOpen(false)} // Close modal function
          isOpen={open}
          datas={selectedEvent} // Pass selected event data if needed
          handleNewAppointment={handleNewAppointment} // Function to handle new appointments
          patientId={selectedEvent ? selectedEvent.id : null} // Pass patient ID if needed
        />

      )}

      {/* Calendar */}
      <button
        onClick={() => setOpen(true)} // Open the modal
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          // height fix screen
          height: 900,
          marginBottom: 50,
        }}
        onSelectEvent={(event) => handleEventClick(event)}
        defaultDate={new Date()}
        timeslots={1}
        resizable
        step={60}
        selectable={true}
        // Custom event style
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
        // Custom date style
        dayPropGetter={(date) => {
          const backgroundColor = 'white';
          const style = {
            backgroundColor,
          };
          return {
            style,
          };
        }}
        // Remove agenda view
        views={['month', 'day', 'week']}
        // Toolbar={false}
        components={{ toolbar: CustomToolbar }}
      />
    </Layout>
  );
}

export default Appointments;

