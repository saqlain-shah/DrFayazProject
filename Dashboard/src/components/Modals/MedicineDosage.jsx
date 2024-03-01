import React, { useState } from 'react';
import Modal from './Modal';
import { BiPlus } from 'react-icons/bi';
import { Button, Checkbox, Input } from '../Form';
import { sortsDatas } from '../Datas';

function MedicineDosageModal({ closeModal, isOpen, addMedicineDosage }) {
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
  const [itemPrice, setItemPrice] = useState('');
  const [item, setItem] = useState(''); // New state for item
  const [instructionText, setInstructionText] = useState(''); // New state for instruction

  const handleAddButtonClick = () => {
    const medicineDosage = {
      instruction: instructionText, // Using the state variable for instruction
      quantity: parseInt(quantity),
      dosageQuantity: parseInt(dosageQuantity),
      itemPrice: parseFloat(itemPrice),
      item: item, // Adding item to the medicine dosage object
      dosage: dosage.filter(item => item.checked).map(item => item.name),
    };

    // Calculate the amount
    const amount = parseFloat(itemPrice) * parseInt(quantity) * parseInt(dosageQuantity);

    // Add amount to medicine dosage object
    medicineDosage.amount = amount;

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
  };


  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      width={'max-w-xl'}
    >
      <div className="flex-colo gap-6">
        <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} label="Quantity" color={true} type={'number'} />
        <Input value={dosageQuantity} onChange={(e) => setDosageQuantity(e.target.value)} label="Dosage Quantity" color={true} type={'number'} />
        <Input value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} label="Item Price" color={true} type={'number'} />
        <Input value={item} onChange={(e) => setItem(e.target.value)} label="Item" color={true} /> {/* Input field for item */}
        <Input value={instructionText} onChange={(e) => setInstructionText(e.target.value)} label="Instruction" color={true} /> {/* Input field for instruction */}

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
