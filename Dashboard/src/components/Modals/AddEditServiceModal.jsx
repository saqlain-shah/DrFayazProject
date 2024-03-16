import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Button, Input, Switchi, Textarea } from '../Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axios from 'axios'; // Import Axios



// Update the AddEditServiceModal component
function AddEditServiceModal({ closeModal, isOpen, datas, onCreate }) {
  const [serviceData, setServiceData] = useState({
    name: '',
    price: 0,
    description: '',
    status: false
  });

  useEffect(() => {
    // Populate modal data when datas prop changes (i.e., when editing)
    if (datas.name) {
      setServiceData(datas);
    }
  }, [datas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSwitchChange = () => {
    setServiceData((prevData) => ({
      ...prevData,
      status: !prevData.status
    }));
  };

  const handleSave = async () => {
    try {
      await onCreate(serviceData);
      closeModal();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service. Please try again.');
    }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={datas.name ? 'Edit Service' : 'New Service'}
      width={'max-w-3xl'}
    >
      <div className="flex-colo gap-6">
        <Input
          label="Service Name"
          name="name"
          color={true}
          value={serviceData.name}
          onChange={handleChange}
        />

        <Input
          label="Service Price (Tsh)"
          type="number"
          name="price"
          color={true}
          value={serviceData.price}
          onChange={handleChange}
        />

        <Textarea
          label="Service Description"
          name="description"
          placeholder="Write description here..."
          color={true}
          rows={5}
          value={serviceData.description}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2 w-full">
          <Switchi
            label="Status"
            checked={serviceData.status}
            onChange={handleSwitchChange}
          />
          <p className={`text-sm ${serviceData.status ? 'text-subMain' : 'text-textGray'}`}>
            {serviceData.status ? 'Enabled' : 'Disabled'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            {datas.name ? 'Discard' : 'Cancel'}
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

export default AddEditServiceModal;
