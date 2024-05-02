import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modals/Modal';
import { Button, Input, Select } from '../../components/Form'; // Import necessary components
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { HiOutlineCheckCircle } from 'react-icons/hi';

import { Switch } from '@headlessui/react';
function AddEditPatientModal({ closeModal, isOpen, patientData, onSave }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    emergencyContact: '',
    address: '',
    bloodGroup: '',
    status: false
  });

  useEffect(() => {
    if (patientData) {
      setFormData(patientData);
    }
  }, [patientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSwitchChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      status: !prevData.status
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      closeModal();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error('Failed to save patient. Please try again.');
    }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={patientData ? 'Edit Patient' : 'New Patient'}
      width={'max-w-3xl'}
    >
      <div className="flex-col gap-6">
        <Input
          label="Full Name"
          name="fullName"
          color={true}
          value={formData.fullName}
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          color={true}
          value={formData.email}
          onChange={handleChange}
        />

        {/* <Input
            label="Phone"
            name="phone"
            type="tel"
            color={true}
            value={formData.phone}
            onChange={handleChange}
          /> */}

        <Input
          label="Gender"
          name="gender"
          color={true}
          value={formData.gender}
          onChange={handleChange}
        />
        {/*   
          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            color={true}
            value={formData.dateOfBirth}
            onChange={handleChange}
          /> */}

        <Input
          label="Emergency Contact"
          name="emergencyContact"
          color={true}
          value={formData.emergencyContact}
          onChange={handleChange}
        />

        <Input
          label="Address"
          name="address"
          color={true}
          value={formData.address}
          onChange={handleChange}
        />

        <Input
          label="Blood Group"
          name="bloodGroup"
          color={true}
          value={formData.bloodGroup}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2 w-full">
          <Switch
            label="Status"
            checked={formData.status}
            onChange={handleSwitchChange}
          />
          <p className={`text-sm ${formData.status ? 'text-subMain' : 'text-textGray'}`}>
            {formData.status ? 'Enabled' : 'Disabled'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            {patientData ? '' : 'Cancel'}
          </button>
          <Button
            label="Save"
            Icon={HiOutlineCheckCircle}
            onClick={handleSave}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddEditPatientModal;
