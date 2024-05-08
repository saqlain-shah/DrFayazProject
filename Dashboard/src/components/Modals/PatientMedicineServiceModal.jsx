import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { BiSearch, BiPlus } from 'react-icons/bi';
import { Button } from '../Form';
import axios from 'axios';

function PatientMedicineServiceModal({ closeModal, isOpen, onSelectService }) {
  const [searchValue, setSearchValue] = useState(''); // State to store search field value
  const [services, setServices] = useState([]); // State to store fetched services

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://server-yvzt.onrender.com /api/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceSelect = (service) => {
    console.log('Selected service:', service);
    onSelectService(service); // Pass selected service to parent component
    closeModal(); // Close the modal
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title="Services"
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
        {/* Dropdown menu for services */}
        <div className="w-full max-h-60 overflow-y-auto border border-border rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {services.map((service) => (
              <li
                key={service._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleServiceSelect(service)}
              >
                {service.name}
              </li>
            ))}
          </ul>
        </div>
        {/* Button */}
        <Button onClick={closeModal} label="Add" Icon={BiPlus} />
      </div>
    </Modal>
  );
}

export default PatientMedicineServiceModal;
