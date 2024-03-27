import React, { useState } from 'react';
import Modal from './Modal';
import { Button, Input } from '../../components/Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function AddDoctorModal({ closeModal, isOpen, doctor, datas }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (event) => {
    setProfileImage(event.target.files[0]);
  };

  const saveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('profileImage', profileImage);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8800/api/doctors',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', response.data);
      toast.success('Doctor information saved successfully');
      closeModal();
    } catch (error) {
      console.error('Error saving doctor information:', error);
      toast.error('Failed to save doctor information');
    }
  };

  return (
    <Modal closeModal={closeModal} isOpen={isOpen}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="text-lg font-semibold">
            {doctor
              ? 'Add Doctor'
              : datas?.id
                ? 'Edit Stuff'
                : 'Add Stuff'}
          </h2>
        </div>
        <div className="modal-body space-y-4">
          <Input
            label="Full Name"
            color='true'
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            color='true'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone Number"
            type="text"
            color='true'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Address"
            type="text"
            color='true'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div>
            <p className="text-sm font-medium">Profile Image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="modal-footer flex justify-end">
          <Button
            label="Cancel"
            variant="secondary"
            onClick={closeModal}
            className="mr-2"
          />
          <Button
            label="Save Changes"
            Icon={HiOutlineCheckCircle}
            onClick={saveChanges}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddDoctorModal;
