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

    useEffect(() => {
        if (appointmentData?.title) {
            setStartDateTime(new Date(appointmentData?.start));
            setEndDateTime(new Date(appointmentData?.end));
            setShares(appointmentData?.shareData);
        }
    }, [appointmentData]);


    const handleSaveAppointment = () => {
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
            })
            .catch(error => {
                // Handle error
                console.error('Error saving appointment:', error);
                toast.error('Failed to save appointment');
            });

        console.log("appointment date", appointmentPayload)
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