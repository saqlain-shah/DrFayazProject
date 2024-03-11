// SelectApppointment.js

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios'; // Import axios

const SelectApppointment = ({ selectedDate, selectTime, setSelectTime }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);

    useEffect(() => {
        const fetchAppointmentSlots = async () => {
            try {
                console.log('Fetching appointment slots for date:', selectedDate);
                const response = await axios.get('http://localhost:8800/api/schedule');
                console.log('Response data:', response.data); // Log the response data
                setAppointmentSlots(response.data);
            } catch (error) {
                console.error('Error fetching appointment slots:', error);
            }
        };

        if (selectedDate) {
            fetchAppointmentSlots();
        }
    }, [selectedDate]);


    const handleSelectTime = (time) => {
        setSelectTime(time);
    };

    return (
        <div>
            <h2>Select Appointment</h2>
            {/* Render your appointment slots here */}
<<<<<<< HEAD
            {appointmentSlots.map((slot) => (
                <div key={slot._id}>
=======
            {appointmentSlots && appointmentSlots.map((slot) => (
                <div key={slot.id}>
>>>>>>> f9ec33d6338475730d781ee3f6f4ca57ec90fe8a
                    <div>Date: {moment(slot.startDateTime).format('YYYY-MM-DD')}</div>
                    <div>Time: {moment(slot.startDateTime).format('HH:mm')} - {moment(slot.endDateTime).format('HH:mm')}</div>
                    <button onClick={() => handleSelectTime(moment(slot.startDateTime).format('HH:mm'))}>Select Time</button>
                </div>
            ))}
        </div>
    );
};

export default SelectApppointment;
