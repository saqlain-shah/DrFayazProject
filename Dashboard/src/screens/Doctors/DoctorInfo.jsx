import React, { useState, useEffect } from 'react';
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
    const [updatedDoctorInfo, setUpdatedDoctorInfo] = useState(null);

    useEffect(() => {
        // Check if values are present in local storage and set state accordingly
        const storedFullName = localStorage.getItem('name');
        const storedEmail = localStorage.getItem('email');
        const storedPhone = localStorage.getItem('phone');
        const storedAddress = localStorage.getItem('address');

        if (storedFullName) setFullName(storedFullName);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhone) setPhone(storedPhone);
        if (storedAddress) setAddress(storedAddress);
    }, []);

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

            setProfileImage(response.data.profileImage);

            // Save profile image URL to local storage
            localStorage.setItem('profileImage', response.data.profileImage);

            // Save other values to local storage
            localStorage.setItem('name', fullName);
            localStorage.setItem('email', email);
            localStorage.setItem('phone', phone);
            localStorage.setItem('address', address);

            toast.success('Doctor information saved successfully');

            setUpdatedDoctorInfo(response.data);

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
                color='true'
                disabled
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
                value={email}
                disabled
                color='true'
            />
            <Input
                label="Address"
                type="text"
                value={address}
                color='true'
                onChange={(e) => setAddress(e.target.value)}
            />
            <div>
                <p className="text-sm">Profile Image</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            <br />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {/* <Button
                    label={'Delete Account'}
                    onClick={() => {
                        toast.error('This feature is not available yet');
                    }}
                /> */}
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
