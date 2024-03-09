// DoctorInfo.jsx
import React, { useState } from 'react';
import { Button, Input } from '../../components/Form';
import { toast } from 'react-hot-toast';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import axios from 'axios';

function DoctorInfo({ closeModal, onSave }) {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
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

            // Set the profile image received in the response
            setProfileImage(response.data.profileImage);

            toast.success('Doctor information saved successfully');
            onSave(response.data);
            closeModal(); // Call closeModal function
        } catch (error) {
            console.error('Error saving doctor information:', error);
            toast.error('Failed to save doctor information');
        }
    };

    return (
        <div className="flex-col gap-4">
            <Input
                label="Full Name"
                color='true'
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <Input
                label="Phone Number"
                type="text"
                color='true'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Input
                label="Email"
                type="email"
                color='true'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                label="Address"
                type="text"
                color='true'
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
                    label={'Delete Account'}
                    onClick={() => {
                        toast.error('This feature is not available yet');
                    }}
                />
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
