// AddAppointmentModal.js

import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modals/Modal';
import SelectApppointment from './SelectApppointment';
import { Button, Steps, message } from 'antd';
import moment from 'moment';
import axios from 'axios'; // Import axios
import BASE_URL from '../../baseUrl.jsx';

function AddAppointmentModal({ closeModal, isOpen, appointmentData }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectTime, setSelectTime] = useState('');
  const [appointmentSlots, setAppointmentSlots] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/schdule`);
      setAppointmentSlots(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSaveAppointment = () => {
    const appointmentPayload = {
      startDateTime,
      endDateTime,
      shares
    };
    const token = 'token'; // Replace this with your actual token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios.post(`${BASE_URL}/api/schdule`, appointmentPayload, config)
      .then(response => {
        toast.success('Appointment saved successfully');
        closeModal();
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
      <div>
        <SelectApppointment
          appointmentSlots={appointmentSlots}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectTime={selectTime}
          setSelectTime={setSelectTime}
        />
        <Button onClick={handleSaveAppointment}>Save</Button>
      </div>
    </Modal>
  );
}

export default AddAppointmentModal;
