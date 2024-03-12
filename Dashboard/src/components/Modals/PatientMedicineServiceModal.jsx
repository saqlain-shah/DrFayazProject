import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { BiSearch, BiPlus } from 'react-icons/bi';
import { Button } from '../Form';
import axios from 'axios';

function PatientMedicineServiceModal({ closeModal, isOpen, patient, onSelectPatient }) {
  const [selectedPatient, setSelectedPatient] = useState(null); // State to store selected patient
  const [searchValue, setSearchValue] = useState(''); // State to store search field value
  const [patients, setPatients] = useState([]); // State to store fetched patients

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8800/api/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleAddPatientClick = () => {
    setSelectedPatient(null); // Reset selected patient when "Add Patient" is clicked
    setSearchValue(''); // Clear search field
    closeModal();
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient); // Set selected patient
    setSearchValue(patient.fullName); // Set search field value to selected patient's name
    closeModal(); // Close the modal
    onSelectPatient(patient.fullName); // Pass selected patient to parent component
    setSearchValue(patient.fullName); // Set search value in parent component
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={patient ? 'Patients' : 'Medicine & Services'}
      width={'max-w-xl'}
    >
      <div className="flex flex-col gap-6">
        {/* Search */}
        <div className="relative flex items-center gap-4 w-full border border-border rounded-lg p-3">
          <input
            type="text"
            placeholder="Search"
            className="w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <BiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
        </div>
        {/* Dropdown menu for patients */}
        <div className="w-full max-h-60 overflow-y-auto border border-border rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <li
                key={patient.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handlePatientSelect(patient)}
              >
                {patient.fullName}
              </li>
            ))}
          </ul>
        </div>
        {/* Button */}
        <Button onClick={handleAddPatientClick} label="Add" Icon={BiPlus} />
      </div>
    </Modal>
  );
}

export default PatientMedicineServiceModal;
