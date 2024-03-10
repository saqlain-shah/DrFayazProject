// SelectApppointment.js

import React from 'react';
import moment from 'moment';

const SelectApppointment = ({ appointmentSlots, selectedDate, setSelectedDate, selectTime, setSelectTime }) => {
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectTime(''); // Reset selectTime when date changes
    };

    const handleSelectTime = (time) => {
        setSelectTime(time);
    };

    return (
        <div>
            <h2>Select Appointment</h2>
            {/* Render your appointment slots here */}
            {appointmentSlots && appointmentSlots.map((slot) => (
                <div key={slot.id}>
                    <div>Date: {moment(slot.startDateTime).format('YYYY-MM-DD')}</div>
                    <div>Time: {moment(slot.startDateTime).format('HH:mm')} - {moment(slot.endDateTime).format('HH:mm')}</div>
                    <button onClick={() => handleDateChange(slot.startDateTime)}>Select Date</button>
                    <button onClick={() => handleSelectTime(moment(slot.startDateTime).format('HH:mm'))}>Select Time</button>
                </div>
            ))}
        </div>
    );
};

export default SelectApppointment;
