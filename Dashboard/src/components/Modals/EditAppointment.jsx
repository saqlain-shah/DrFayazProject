import React, { useState } from 'react';
import Modal from './Modal';
import { Button, Checkbox, DatePickerComp, Input, Select, Textarea, TimePickerComp } from '../Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const EditAppointmentModal = ({ isOpen, closeModal, appointment, onUpdateAppointment }) => {
    const { _id, patientName, purposeOfVisit, dateOfVisit, startTime, endTime, status, doctor, share, description } = appointment;

    const [editedPatientName, setEditedPatientName] = useState(patientName);
    const [editedPurposeOfVisit, setEditedPurposeOfVisit] = useState(purposeOfVisit);
    const [editedDateOfVisit, setEditedDateOfVisit] = useState(new Date(dateOfVisit));
    const [editedStartTime, setEditedStartTime] = useState(new Date(startTime));
    const [editedEndTime, setEditedEndTime] = useState(new Date(endTime));
    const [editedStatus, setEditedStatus] = useState(status);
    const [editedDoctor, setEditedDoctor] = useState(doctor);
    const [editedDescription, setEditedDescription] = useState(description); // Define state for editedDescription
    const [editedShare, setEditedShare] = useState(share);

    const onChangeShare = (e) => {
        setEditedShare({ ...editedShare, [e.target.name]: e.target.checked });
    };

    const saveAppointment = () => {
        const apiUrl = `https://server-yvzt.onrender.com /api/appointments/${_id}`;

        // Format date and time values to strings
        const formattedDateOfVisit = editedDateOfVisit.toISOString();
        const formattedStartTime = editedStartTime.toISOString();
        const formattedEndTime = editedEndTime.toISOString();

        const data = {
            patientName: editedPatientName,
            purposeOfVisit: editedPurposeOfVisit,
            dateOfVisit: formattedDateOfVisit,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            doctor: editedDoctor,
            status: editedStatus,
            description: editedDescription,
            share: editedShare,
        };

        console.log("Updating appointment data:", data);
        const token = localStorage.getItem('token');

        axios.put(apiUrl, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log('Appointment updated successfully:', response.data);
                toast.success('Appointment updated successfully');
                // Call the onUpdateAppointment function passed from the parent component to update the state
                onUpdateAppointment(response.data);
                closeModal();
            })
            .catch(error => {
                console.error('Error updating appointment:', error);
                toast.error('Error updating appointment. Please try again later.');
            });
    };

    return (
        <Modal
            closeModal={closeModal}
            isOpen={isOpen}
            title="Edit Appointment"
            width={'max-w-3xl'}
        >
            <div className="flex flex-col gap-6">
                <Input
                    label="Patient Name"
                    value={editedPatientName}
                    color='true'
                    onChange={(e) => setEditedPatientName(e.target.value)}
                />
                <Input
                    label="Purpose of Visit"
                    value={editedPurposeOfVisit}
                    color='true'
                    onChange={(e) => setEditedPurposeOfVisit(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                    <DatePickerComp
                        label="Date of Visit"
                        startDate={editedDateOfVisit}
                        onChange={(date) => setEditedDateOfVisit(date)}
                    />
                    <TimePickerComp
                        label="Start Time"
                        time={editedStartTime}
                        onChange={(time) => setEditedStartTime(time)}
                    />
                    <TimePickerComp
                        label="End Time"
                        time={editedEndTime}
                        onChange={(time) => setEditedEndTime(time)}
                    />
                </div>
                <Input
                    label="Doctor"
                    value={editedDoctor}
                    color='true'
                    onChange={(e) => setEditedDoctor(e.target.value)}
                />
                <Input
                    label="Status"
                    value={editedStatus}
                    color='true'
                    onChange={(e) => setEditedStatus(e.target.value)}
                />
                <Textarea
                    label="Description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Enter description"
                    rows={5}
                />
                <div className="flex flex-col gap-4">
                    <p className="text-black text-sm">Share with patient via</p>
                    <div className="flex gap-4">
                        <Checkbox
                            name="email"
                            checked={editedShare.email}
                            onChange={onChangeShare}
                            label="Email"
                        />
                        <Checkbox
                            name="sms"
                            checked={editedShare.sms}
                            onChange={onChangeShare}
                            label="SMS"
                        />
                        <Checkbox
                            name="whatsapp"
                            checked={editedShare.whatsapp}
                            onChange={onChangeShare}
                            label="WhatsApp"
                        />
                    </div>
                </div>
                <div className="flex justify-between">
                    <Button
                        label="Cancel"
                        onClick={closeModal}
                        className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
                    />
                    <Button
                        label="Save"
                        Icon={HiOutlineCheckCircle}
                        onClick={saveAppointment}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditAppointmentModal;
