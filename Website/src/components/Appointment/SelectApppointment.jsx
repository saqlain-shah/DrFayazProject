import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const SelectAppointment = ({ handleSelectAppointment }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8800/api/schedule', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const filteredSlots = response.data.filter(slot => moment(slot.endDateTime).isAfter(slot.startDateTime));
                setAppointmentSlots(filteredSlots);
            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };

        fetchSchedule();
    }, []);

    const handleSlotSelection = (slotId) => {
        console.log("Appointment slot with ID", slotId, "selected");
        handleSelectAppointment(appointmentSlots.filter(slot => slot._id === slotId)); // Pass the slot object or slot array to the parent component
    };



    return (

        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Select Appointment</h2>
            <div className="flex flex-wrap" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                {appointmentSlots && appointmentSlots.length > 0 ? (
                    appointmentSlots.map((slot, index) => (
                        <div key={slot._id} className="border border-gray-300 rounded-md p-2 flex flex-col justify-between m-2" style={{ width: '150px', minWidth: '150px' }}>
                            <div className="text-sm font-semibold">{moment(slot.startDateTime).format('YYYY-MM-DD')}</div>
                            <div className="text-xs mt-1">{moment(slot.startDateTime).format('HH:mm')} - {moment(slot.endDateTime).format('HH:mm')}</div>
                            <button onClick={() => handleSlotSelection(slot._id)} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" style={{ backgroundColor: '#3B82F6', fontSize: '10px' }}>
                                Select
                            </button>
                        </div>
                    ))
                ) : (
                    <div>No appointment slots available.</div>
                )}
            </div>

            {/* <div>
            <h2>Select Appointment</h2>
            {/* Render your appointment slots here */}
            {/* {appointmentSlots && appointmentSlots.map((slot) => (
                <div key={slot.id}>
                    <div>Date: {moment(slot.startDateTime).format('YYYY-MM-DD')}</div>
                    <div>Time: {moment(slot.startDateTime).format('HH:mm')} - {moment(slot.endDateTime).format('HH:mm')}</div>
                    <button onClick={() => handleSelectTime(moment(slot.startDateTime).format('HH:mm'))}>Select Time</button>
                </div>
            ))} */}
        </div>
    );
};

export default SelectAppointment;
