import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { sortsDatas } from '../../components/Datas';
import { Button, Input, Select, Textarea } from '../../components/Form';
import Modal from '../../components/Modals/Modal';
import { BiChevronDown } from 'react-icons/bi';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

function HealthInformation({ patientId }) {
  const [bloodType, setBloodType] = useState(sortsDatas.bloodTypeFilter[0]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [allergies, setAllergies] = useState('');
  const [habits, setHabits] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [healthInfoData, setHealthInfoData] = useState({}); // State for health information data

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      console.log('Patient ID:', patientId); // Log the patientId
      const response = await axios.post(
        'http://localhost:8800/api/health-information',
        {
          patientId, // Pass patientId here
          bloodType: bloodType.name,
          weight,
          height,
          allergies,
          habits,
          medicalHistory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response from server:', response.data);
      toast.success('Health information saved successfully');

      // Set health information data for modal
      setHealthInfoData({
        bloodType: bloodType.name,
        weight,
        height,
        allergies,
        habits,
        medicalHistory,
      });

      // Show modal after successful submission
      setShowModal(true);

      // Clear input fields after successful submission
      setBloodType(sortsDatas.bloodTypeFilter[0]);
      setWeight('');
      setHeight('');
      setAllergies('');
      setHabits('');
      setMedicalHistory('');
    } catch (error) {
      console.error('Error saving health information:', error);
      toast.error('Error saving health information');
    }
  };

  return (
    <div className="flex-colo gap-4">
      <div className="flex gap-3 flex-col w-full col-span-6">
        <div className="flex w-full flex-col gap-3">
          <p className="text-black text-sm">Blood Group</p>
          <Select
            selectedPerson={bloodType}
            setSelectedPerson={setBloodType}
            datas={sortsDatas.bloodTypeFilter}
          >
            <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
              {bloodType?.name} <BiChevronDown className="text-xl" />
            </div>
          </Select>
        </div>

        <Input label="Weight" color={true} type="text" placeholder={'60kg'} value={weight} onChange={(e) => setWeight(e.target.value)} />
        <Input label="Height" color={true} type="text" placeholder={'5.5ft'} value={height} onChange={(e) => setHeight(e.target.value)} />
        <Textarea label="Allergies" color={true} rows={3} placeholder={'beans, nuts, etc'} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        <Textarea label="Habits" color={true} rows={3} placeholder={'smoking, drinking, etc'} value={habits} onChange={(e) => setHabits(e.target.value)} />
        <Textarea label="Medical History" color={true} rows={3} placeholder={'diabetes, malaria, glaucoma, etc'} value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />

        <Button
          label={'Save Changes'}
          Icon={HiOutlineCheckCircle}
          onClick={handleSubmit}
        />
        {/* Modal to display health information */}
        <Modal closeModal={() => setShowModal(false)} isOpen={showModal} width="w-96" title="Health Information">
          <div className="text-left">
            <p className="mb-2"><span className="font-semibold">Blood Type:</span> {healthInfoData.bloodType}</p>
            <p className="mb-2"><span className="font-semibold">Weight:</span> {healthInfoData.weight}</p>
            <p className="mb-2"><span className="font-semibold">Height:</span> {healthInfoData.height}</p>
            <p className="mb-2"><span className="font-semibold">Allergies:</span> {healthInfoData.allergies}</p>
            <p className="mb-2"><span className="font-semibold">Habits:</span> {healthInfoData.habits}</p>
            <p className="mb-2"><span className="font-semibold">Medical History:</span> {healthInfoData.medicalHistory}</p>
          </div>
        </Modal>


      </div>
    </div>
  );
}

export default HealthInformation;
