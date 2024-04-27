// AddItemModal.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import { BiPlus } from 'react-icons/bi';
import { Input, Button } from '../Form';
import PatientMedicineServiceModal from './PatientMedicineServiceModal';

function AddItemModal({ closeModal, isOpen, handleAddItem }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [isPatientMedicineModalOpen, setIsPatientMedicineModalOpen] = useState(false);

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAddItemClick = () => {
    if (selectedService && quantity > 0) {
      console.log('Adding item:', selectedService, quantity); // Log selected service and quantity
      handleAddItem(selectedService, quantity); // Pass the selected service and quantity to the parent component
      closeModal();
    } else {
      console.log('Invalid selection'); // Log invalid selection
      // Handle error case where service is not selected or quantity is invalid
    }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title="Add Item"
      width={'max-w-xl'}
    >
      <div className="flex-colo gap-6">
        <div className="flex flex-col gap-4 w-full">
          <p className="text-black text-sm">Service</p>
          {/* Display selected service */}
          {selectedService && (
            <div className="bg-gray-100 p-2 rounded-lg">
              {selectedService.name} {/* Display selected service name */}
            </div>
          )}
          {/* Button to open service selection modal */}
          <button
            onClick={() => setIsPatientMedicineModalOpen(true)}
            className="text-subMain flex-rows gap-2 rounded-lg border border-subMain border-dashed py-4 w-full text-sm"
          >
            <BiPlus /> Add Item
          </button>
        </div>
        <Input
          label="Quantity"
          color={true}
          type={'number'}
          value={quantity}
          onChange={handleQuantityChange}
        />
        <Button onClick={handleAddItemClick} label="Add" Icon={BiPlus} />
      </div>
      {/* Render service selection modal */}
      {isPatientMedicineModalOpen && (
        <PatientMedicineServiceModal
          closeModal={() => setIsPatientMedicineModalOpen(false)}
          isOpen={isPatientMedicineModalOpen}
          // Pass selected service to update state
          onSelectService={(selectedService) => {
            setSelectedService(selectedService);
          }}
        />
      )}
    </Modal>
  );
}

export default AddItemModal;
