// AddEditMedicineModal component
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Button, Input, Select, Textarea } from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { sortsDatas } from '../Datas';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
function AddEditMedicineModal({ closeModal, isOpen, onClose, selectedItem }) {
  const [formData, setFormData] = useState({
    name: '',
    measure: sortsDatas.measure[0]?.name || '',
    price: 0,
    stock: 0,
    description: '',
  });

  const [showMeasureOptions, setShowMeasureOptions] = useState(false); // Define showMeasureOptions state
  useEffect(() => {
    if (selectedItem) {
      // Find the measure object corresponding to the selectedItem's measure ID
      const selectedMeasure = sortsDatas.measure.find(measure => measure.id === selectedItem.measure);

      // Populate form fields with selected item data when editing
      setFormData({
        name: selectedItem.medicineName,
        measure: selectedMeasure ? selectedMeasure.name : '', // Use the unit name if found, otherwise an empty string
        price: selectedItem.price,
        stock: selectedItem.inStock,
        description: selectedItem.description,
      });
    }
  }, [selectedItem]);
  console.log(formData)

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleMeasureChange = (selectedMeasureId) => {
    console.log('Selected Measure ID:', selectedMeasureId);
    const selectedMeasure = sortsDatas.measure.find(measure => measure.id === selectedMeasureId);
    console.log('Selected Measure:', selectedMeasure); // Debug log
    if (selectedMeasure) {
      setFormData((prevData) => ({
        ...prevData,
        measure: selectedMeasureId,
      }));
    }
    setShowMeasureOptions(false);
  };

  const handleSubmit = async () => {
    try {
      // If editing an existing medicine, delete the previous entry
      if (selectedItem) {
        const deleteResponse = await fetch(`http://localhost:8800/api/medicine/${selectedItem._id}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          throw new Error('Failed to delete previous medicine entry');
        }
      }

      // Determine the value of the inStock field based on the stock value
      const inStock = formData.stock > 0;

      // Create a new medicine entry with the updated information
      const createResponse = await fetch('http://localhost:8800/api/medicine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicineName: formData.name,
          measure: formData.measure,
          price: formData.price,
          inStock: inStock, // Set the value of inStock
          description: formData.description,
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to save data');
      }

      const responseData = await createResponse.json();
      closeModal();
      toast.success('Medicine added successfully');
      onClose(responseData);

    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(error.message);
    }
  };



  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={selectedItem ? "Edit Medicine" : "New Medicine"}
      width={'max-w-3xl'}
    >
      <div className="flex-col gap-6">
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <Input
            name="name"
            label="Medicine Name"
            color={true}
            value={formData.name}
            onChange={handleInputChange}
          />
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Measure</p>
            <div className="relative">
              <div
                className="w-full flex-btn text-main text-sm p-4 border bg-dry border-border font-light rounded-lg cursor-pointer"
                onClick={() => setShowMeasureOptions(!showMeasureOptions)}
              >
                {sortsDatas.measure.find(measure => measure.id === formData.measure)?.name} <BiChevronDown className="text-xl" />
              </div>
              {showMeasureOptions && (
                <div className="absolute z-10 top-full left-0 w-full bg-white border border-gray-300 shadow-md rounded-b-lg">
                  {sortsDatas.measure.map(measure => (
                    <div
                      key={measure.id}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleMeasureChange(measure.id)}
                    >
                      {measure.name} {/* Display the unit name */}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <Input
            name="price"
            label="Price (Tsh)"
            type="number"
            color={true}
            value={formData.price}
            onChange={handleInputChange}
          />
          <Input
            name="stock"
            label="Instock"
            type="number"
            color={true}
            value={formData.stock}
            onChange={handleInputChange}
          />
        </div>

        <Textarea
          name="description"
          label="Description"
          placeholder="Write description here..."
          color={true}
          rows={5}
          value={formData.description}
          onChange={handleInputChange}
        />

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            Cancel
          </button>

          <Button
            label="Save"
            Icon={HiOutlineCheckCircle}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddEditMedicineModal;