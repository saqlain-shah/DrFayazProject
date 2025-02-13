import React, { useState } from 'react';
import { Button, Input } from '../../components/Form';
import { toast } from 'react-hot-toast';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import axios from 'axios';
import BASE_URL from '../../baseUrl.jsx';

function DoctorInfo({ closeModal, onSave, doctorData }) {
  const [fullName, setFullName] = useState(doctorData?.fullName || '');
  const [phone, setPhone] = useState(doctorData?.phone || '');
  const [email, setEmail] = useState(doctorData?.email || '');
  const [address, setAddress] = useState(doctorData?.address || '');
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (event) => {
    setProfileImage(event.target.files[0]);
  };

  const saveChanges = async () => {
    try {
      // Log profileImage to check if it is being set
      console.log('Profile Image:', profileImage);
      
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
  
      // Ensure profileImage is set
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
  
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/doctors/update/${doctorData?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Remove Content-Type header
          },
        }
      );
      
      console.log("Doctor info response:", response.data);  // Inspect the response
      toast.success('Doctor information saved successfully');
      onSave(response.data);
      closeModal();
    } catch (error) {
      console.error('Error saving doctor information:', error);
      toast.error('Failed to save doctor information');
    }
  };

  return (
    <div className="flex-col gap-4">
      <Input
        label="Full Name"
        type="text"
        value={fullName}
        color="true"
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        label="Phone Number"
        type="text"
        color="true"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        color="true"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Address"
        type="text"
        color="true"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <div>
        <p className="text-sm">Profile Image</p>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Button
          label={'Save Changes'}
          Icon={HiOutlineCheckCircle}
          onClick={saveChanges}
        />
      </div>
    </div>
  );
}

export default DoctorInfo;
