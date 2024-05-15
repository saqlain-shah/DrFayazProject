// PersonalInfo.jsx
import React, { useState } from 'react';
import { sortsDatas } from '../Datas';
import { Button, DatePickerComp, Select, Input } from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function PersonalInfo({ titles, onSave }) {
  const [profilePicture, setImageUrl] = useState('');
  const [title, setTitle] = useState(sortsDatas.title[0]);
  // const [date, setDate] = useState(new Date());
  const [gender, setGender] = useState(sortsDatas.genderFilter[0]);
  const [bloodGroup, setBloodGroup] = useState('');
  const [firstName, setFirstName] = useState('');
  //const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const saveChanges = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const data = new FormData();
      data.append('profilePicture', profilePicture);
      data.append('firstName', firstName);
      data.append('email', email);
      // data.append('phone', phone);
      data.append('gender', gender.name);
      // data.append('dateOfBirth', date.toISOString());
      data.append('emergencyContact', emergencyContact);
      data.append('address', address);
      data.append('bloodGroup', bloodGroup);

      console.log('Data to be sent:', data);

      await axios.post('http://localhost:8800/api/patients', data, {

        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Include token in the request headers
        },
      });

      toast.success('Patient created and Update successfully');

      setImageUrl('');
      setTitle(sortsDatas.title[0]);
      // setDate(new Date());
      setGender(sortsDatas.genderFilter[0]);
      setBloodGroup('');
      setFirstName('');
      //  setPhone('');
      setEmail('');
      setEmergencyContact('');
      setAddress('');
      navigate('/patients')
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to create patient');
    }
  };



  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUrl(file); // Set the file object directly
    }
  };

  return (
    <div className="flex-col gap-4">
      <div className="flex gap-3 flex-col w-full col-span-6">
        <p className="text-sm">Profile Image</p>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {titles && (
        <div className="flex w-full flex-col gap-3">
          <p className="text-black text-sm">Title</p>
          <Select
            selectedPerson={title}
            setSelectedPerson={setTitle}
            datas={sortsDatas.title}
          >
            <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
              {title?.name} <BiChevronDown className="text-xl" />
            </div>
          </Select>
        </div>
      )}

      <Input
        label="Full Name"
        color={true}
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />


      {/* <Input
        label="Phone Number"
        color={true}
        type="number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /> */}

      <Input
        label="Email"
        color={true}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Emergency Contact"
        color={true}
        type="text"
        value={emergencyContact}
        onChange={(e) => setEmergencyContact(e.target.value)}
      />
      <Input
        label="Blood Group"
        color={true}
        type="text"
        value={bloodGroup}
        onChange={(e) => setBloodGroup(e.target.value)}
        placeholder="Enter your blood group"
      />
      <Input
        label="Address"
        color={true}
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      {!titles && (
        <>
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Gender</p>
            <Select
              selectedPerson={gender}
              setSelectedPerson={setGender}
              datas={sortsDatas.genderFilter}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {gender?.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>

          {/* <DatePickerComp
            label="Date of Birth"
            startDate={date}
            onChange={(date) => setDate(date)}
          /> */}
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* <Button
          label={'Delete Account'}
          Icon={RiDeleteBin5Line}
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

export default PersonalInfo;
