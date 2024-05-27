import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const SelectAppointment = ({ handleSelectAppointment, patientId }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get('https://server-yvzt.onrender.com/api/schedule');
    
                // Filter out expired slots and set the remaining slots
                const filteredSlots = response.data.filter(slot => moment(slot.endDateTime).isAfter(moment()));
                setAppointmentSlots(filteredSlots);
    
                // Delete expired slots after a timeout
                filteredSlots.forEach(slot => {
                    if (moment(slot.endDateTime).isBefore(moment())) {
                        deleteExpiredSlot(slot._id);
                    }
                });
            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };
    
        fetchSchedule();
    }, []);

    const deleteExpiredSlot = async (slotId) => {
        try {
            await axios.delete(`https://server-yvzt.onrender.com/api/schedule/${slotId}`);
            console.log('Expired slot deleted:', slotId);
        } catch (error) {
            console.error('Error deleting expired slot:', error);
        }
    };

    const handleSlotSelection = (slotId) => {
        const selectedSlot = appointmentSlots.find(slot => slot._id === slotId);
        if (selectedSlot) {
            setSelectedSlot(selectedSlot);
            handleSelectAppointment(selectedSlot, patientId); // Pass patientId
        }
    };

    // Conditional rendering to prevent rendering when appointmentSlots is null
    if (!appointmentSlots || appointmentSlots.length === 0) {
        return <div>No appointments available at this time.</div>;
    }
  

    return (
        <div className="container">
            <h5 className="text-2xl font-bold mb-4">Select Appointment</h5>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', alignItems: 'center' }}>
                {appointmentSlots.slice(0, 3).map((slot, index) => (
                    <div
                        key={slot._id}
                        className="custom-slot"
                        style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            minWidth: '200px',
                            maxWidth: '300px',
                            background: 'white',
                            margin: '10px',
                            padding: '10px',
                            backgroundColor: selectedSlot && selectedSlot._id === slot._id ? '#d1fae5' : '#ffffff'
                        }}
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
                                style={{ marginRight: '0.5rem' }}
                            />
                            <span className="font-semibold">{selectedSlot && selectedSlot._id === slot._id ? 'Selected' : 'Select'}</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SelectAppointment;