import React, { useState } from 'react';
import Modal from './Modal';
import { BiPlus } from 'react-icons/bi';
import { Button, Checkbox, Input } from '../Form';
import { sortsDatas } from '../Datas';

function MedicineDosageModal({ closeModal, isOpen, addMedicineDosage, medicine, instruction }) {
  const [dosage, setDosage] = useState(
    sortsDatas.dosage
      ? sortsDatas.dosage.map((item) => ({
        name: item.name,
        checked: false, // Initialize checked property to false
      }))
      : []
  );

  const [quantity, setQuantity] = useState('');
  const [dosageQuantity, setDosageQuantity] = useState('');

  const handleAddButtonClick = () => {
    const medicineDosage = {
      medicine: medicine,
      instruction: instruction,
      quantity: parseInt(quantity),
      dosageQuantity: parseInt(dosageQuantity),
      dosage: dosage.filter(item => item.checked).map(item => item.name),
    };

    addMedicineDosage(medicineDosage);
    closeModal();
  };

  const onChangeDosage = (name, checked) => {
    const newDosage = dosage.map((item) => {
      if (item.name === name) {
        return {
          ...item,
          checked: checked,
        };
      }
      return item;
    });
    setDosage(newDosage);

    // Call onChangeMedicine to update the parent component state
    onChangeMedicine(name, checked);
  };


  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={`Add ${medicine}`}
      width={'max-w-xl'}
    >
      <div className="flex-colo gap-6">
        <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} label="Quantity" color={true} type={'number'} />
        <Input value={dosageQuantity} onChange={(e) => setDosageQuantity(e.target.value)} label="Dosage Quantity" color={true} type={'number'} />

        <div className="flex w-full flex-col gap-4">
          <p className="text-black text-sm">Dosage</p>
          <div className="grid xs:grid-cols-3 gap-6 pb-6">
            {dosage.map((item) => (
              <Checkbox
                label={item.name}
                checked={item.checked}
                onChange={(checked) => onChangeDosage(item.name, checked)} // Pass both name and checked state
                key={item.id}
              />
            ))}
          </div>

        </div>
        <Button onClick={handleAddButtonClick} label="Add" Icon={BiPlus} />
      </div>
    </Modal>
  );
}

export default MedicineDosageModal;
