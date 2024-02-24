import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { BiPlus } from 'react-icons/bi';
import { Input, Button } from '../Form';
import PatientMedicineServiceModal from './PatientMedicineServiceModal';

function AddItemModal({ closeModal, isOpen }) {
  const [items, setItems] = useState([]);
  const [medicineServices, setMedicineServices] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPatientMedicineModalOpen, setIsPatientMedicineModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchMedicineServices();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8800/api/invoices/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMedicineServices = async () => {
    try {
      const response = await fetch('http://localhost:8800/api/medical-records');
      if (!response.ok) {
        throw new Error('Failed to fetch medicine services');
      }
      const data = await response.json();
      setMedicineServices(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAddItemClick = () => {
    setIsPatientMedicineModalOpen(!isPatientMedicineModalOpen);
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
          <button
            onClick={handleAddItemClick}
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
        {selectedItem && (
          <div className="flex flex-col gap-4 w-full">
            <p className="text-black text-sm">Summary</p>
            <div className="flex flex-col gap-4">
              {/* Summary details */}
            </div>
          </div>
        )}
        <Button onClick={closeModal} label="Add" Icon={BiPlus} />
      </div>
      {isPatientMedicineModalOpen && (
        <PatientMedicineServiceModal
          closeModal={() => setIsPatientMedicineModalOpen(false)}
          isOpen={isPatientMedicineModalOpen}
          items={items}
          medicineServices={medicineServices}
        />
      )}
    </Modal>
  );
}

export default AddItemModal;
