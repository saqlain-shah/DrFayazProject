import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modals/Modal';
import {
    Button,
} from '../../components/Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import axios from 'axios'; // Import axios

import 'react-datepicker/dist/react-datepicker.css';

function AddAppointmentModal({ closeModal, isOpen, appointmentData }) {
    const [startDateTime, setStartDateTime] = useState(new Date());
    const [endDateTime, setEndDateTime] = useState(new Date());
    const [shares, setShares] = useState({
        email: false,
        sms: false,
        whatsapp: false,
    });
    const [existingAppointments, setExistingAppointments] = useState([]);

    useEffect(() => {
        // Fetch token from localStorage
        const token = localStorage.getItem('token');
    
        // Fetch existing appointments from the API
        axios.get('http://localhost:8800/api/schedule', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setExistingAppointments(response.data);
        })
        .catch(error => {
            console.error('Error fetching existing appointments:', error);
        });
    }, []);
    

    useEffect(() => {
        if (appointmentData?.title) {
            setStartDateTime(new Date(appointmentData?.start));
            setEndDateTime(new Date(appointmentData?.end));
            setShares(appointmentData?.shareData);
        }
    }, [appointmentData]);


    const handleSaveAppointment = () => {
        const isInvalidTimeRange = endDateTime < startDateTime ||
        (endDateTime.getHours() === startDateTime.getHours() &&
            endDateTime.getMinutes() === startDateTime.getMinutes());

    if (isInvalidTimeRange) {
        // If the time range is invalid, display a message and return without saving
        toast.error('Invalid time range. Please select a valid time range.');
        return;
    }

    // Check if both startDateTime and endDateTime are already booked
    const isAlreadyBooked = existingAppointments.some(appointment => {
        const appointmentStart = new Date(appointment.startDateTime);
        const appointmentEnd = new Date(appointment.endDateTime);
        return (
            (startDateTime >= appointmentStart && startDateTime < appointmentEnd) &&
            (endDateTime > appointmentStart && endDateTime <= appointmentEnd)
        );
    });

    if (isAlreadyBooked) {
        // If both start time and end time are already booked, display an error message and return without saving
        toast.error('Appointment time is already booked. Please select a different time.');
        return;
    }
    
        // Calculate the duration of the appointment in milliseconds
        const duration = endDateTime.getTime() - startDateTime.getTime();
    
        // Here you can handle saving the appointment
        // You can use startDateTime, endDateTime, and shares state values
        // For example, you can send a request to your backend API to save the appointment
    
        // Fetch token from localStorage
        const token = localStorage.getItem('token');
    
        const appointmentPayload = {
            startDateTime,
            endDateTime,
            shares
        };
    
        axios.post('http://localhost:8800/api/schedule', appointmentPayload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // Handle success
                toast.success('Appointment saved successfully');
                closeModal();
    
                // Automatically delete the appointment after the duration
                setTimeout(() => {
                    setAppointments(prevAppointments =>
                        prevAppointments.filter(appointment => appointment.id !== response.data._id)
                    );
                }, duration);
            })
            .catch(error => {
                // Handle error
                console.error('Error saving appointment:', error);
                toast.error('Failed to save appointment');
            });
    
       
    };
    
    
    
    

    return (
        <Modal
            closeModal={closeModal}
            isOpen={isOpen}
            title={appointmentData?.title ? 'Edit Appointment' : 'New Schedule Timing'}
        >
            <div className="flex-col gap-4 h-96">
                <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <div className="text-sm w-full">
                        <label className={'text-black text-sm'}>Start Date and Time</label>
                        <DatePicker
                            selected={startDateTime}
                            onChange={date => setStartDateTime(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full bg-transparent text-sm mt-3 p-4 border border-border font-light rounded-lg focus:border focus:border-subMain "
                        />
                    </div>
                    <div className="text-sm w-full">
                        <label className={'text-black text-sm'}>End Date and Time</label>
                        <DatePicker
                            selected={endDateTime}
                            onChange={date => setEndDateTime(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full bg-transparent text-sm mt-3 p-4 border border-border font-light rounded-lg focus:border focus:border-subMain"
                        />
                    </div>
                </div>
                {/* buttons */}
                <div className="grid sm:grid-cols-2 gap-4 w-full">
                    <button
                        onClick={closeModal}
                        className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
                    >
                        {appointmentData?.title ? 'Discard' : 'Cancel'}
                    </button>
                    <Button
                        label="Save"
                        Icon={HiOutlineCheckCircle}
                        onClick={handleSaveAppointment}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default AddAppointmentModal;