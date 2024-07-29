import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modals/Modal';
import { Button } from '../../components/Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { DatePicker, Space } from 'antd';

function AddAppointmentModal({ closeModal, isOpen, appointmentData }) {
    const [startDateTime, setStartDateTime] = useState(null);
    const [endDateTime, setEndDateTime] = useState(null);
    const [shares, setShares] = useState({
        email: false,
        sms: false,
        whatsapp: false,
    });
    const [existingAppointments, setExistingAppointments] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8800/api/schedule')
        .then(response => {
            setExistingAppointments(response.data);
        })
        .catch(error => {
            console.error('Error fetching existing appointments:', error);
        });
    }, []);

    useEffect(() => {
        if (appointmentData) {
            setStartDateTime(new Date(appointmentData.start));
            setEndDateTime(new Date(appointmentData.end));
            setShares(appointmentData.shareData);
        }
    }, [appointmentData]);

    const handleSaveAppointment = () => {
        if (!startDateTime || !endDateTime) {
            toast.error('Please select start and end date-time.');
            return;
        }

        if (endDateTime <= startDateTime) {
            toast.error('Invalid time range. Please select a valid time range.');
            return;
        }

        const isAlreadyBooked = existingAppointments.some(appointment => {
            const appointmentStart = new Date(appointment.startDateTime);
            const appointmentEnd = new Date(appointment.endDateTime);
            return (
                (startDateTime >= appointmentStart && startDateTime < appointmentEnd) ||
                (endDateTime > appointmentStart && endDateTime <= appointmentEnd)
            );
        });

        if (isAlreadyBooked) {
            toast.error('Appointment time is already booked. Please select a different time.');
            return;
        }

        const appointmentPayload = {
            startDateTime,
            endDateTime,
            shares
        };

        axios.post('http://localhost:8800/api/schedule', appointmentPayload)
        .then(response => {
            toast.success('Appointment saved successfully');
            closeModal();
            setExistingAppointments(prevAppointments => [...prevAppointments, response.data]);
        })
        .catch(error => {
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
            <div className="flex flex-col gap-4 h-96 p-4">
                <Space direction="vertical" size={12}>
                    <div className="text-sm w-full">
                        <label className="text-black text-sm mb-2 block">Start Date and Time</label>
                        <DatePicker
                            showTime
                            value={startDateTime}
                            onChange={date => setStartDateTime(date)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="text-sm w-full">
                        <label className="text-black text-sm mb-2 block">End Date and Time</label>
                        <DatePicker
                            showTime
                            value={endDateTime}
                            onChange={date => setEndDateTime(date)}
                            style={{ width: '100%' }}
                        />
                    </div>
                </Space>
                <div className="grid sm:grid-cols-2 gap-4 w-full mt-4">
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
