import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const SelectAppointment = ({ handleSelectAppointment, patientId }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

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
        const selectedSlot = appointmentSlots.find(slot => slot._id === slotId);
        if (selectedSlot) {
            setSelectedSlot(selectedSlot);
            handleSelectAppointment(selectedSlot, patientId); // Pass patientId
        }
    };

    return (
        <div className="container">
            <h5 className="text-2xl font-bold mb-4">Select Appointment</h5>
            <div className="flex justify-center flex-wrap m-8 ">
                {appointmentSlots && appointmentSlots.length > 0 ? (
                    appointmentSlots.map((slot, index) => (
                        <div
                            key={slot._id}
                            className={`p-4 border rounded-md shadow-md cursor-pointer ${selectedSlot && selectedSlot._id === slot._id ? 'bg-green-100' : 'bg-white'}`}
                            style={{ minWidth: '200px', maxWidth: '300px', margin: '10px' }}
                            onClick={() => handleSlotSelection(slot._id)}
                        >
                            <div className="font-bold">{moment(slot.startDateTime).format('YYYY-MM-DD')}</div>
                            <div>{moment(slot.startDateTime).format('hh:mm A')} - {moment(slot.endDateTime).format('hh:mm A')}</div>
                            <label className="flex items-center mt-2">
                                <input
                                    type="radio"
                                    name="appointmentSlot"
                                    value={slot._id}
                                    checked={selectedSlot && selectedSlot._id === slot._id}
                                    onChange={() => handleSlotSelection(slot._id)}
                                    className="mr-2"
                                />
                                <span className="font-semibold">{selectedSlot && selectedSlot._id === slot._id ? 'Selected' : 'Select'}</span>
                            </label>
                        </div>
                    ))
                ) : (
                    <div>No appointment slots available.</div>
                )}
            </div>
        </div>
    );
};

export default SelectAppointment;
