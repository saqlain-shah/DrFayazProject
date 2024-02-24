import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { BiSearch, BiPlus } from 'react-icons/bi';
import { RadioGroup } from '@headlessui/react';
import { Button } from '../Form';

function PatientMedicineServiceModal({ closeModal, isOpen, patient }) {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null); // Define the selected state variable

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8800/api/invoices/items'); // Assuming '/api/items' is your endpoint to fetch items
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={patient ? 'Patients' : 'Medicine & Services'}
      width={'max-w-xl'}
    >
      <div className="flex-colo gap-6">
        {/* search */}
        <div className="flex items-center gap-4 w-full border border-border rounded-lg p-3">
          <input type="text" placeholder="Search" className="w-full" />
          <BiSearch className=" text-xl" />
        </div>
        {/* data */}
        <div className="w-full h-[500px] overflow-y-scroll">
          <RadioGroup value={selected} onChange={setSelected}>
            <div className="space-y-2">
              {data.map((user) => (
                <RadioGroup.Option
                  key={user.id}
                  value={user}
                  className={({ active, checked }) =>
                    `${active ? 'border-subMain bg-subMain text-white' : ''}
                    rounded-xl border-[1px] border-border p-4 group hover:bg-subMain hover:text-white`
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <h6 className="text-sm">
                        {patient ? user.title : user.name}
                      </h6>
                      {patient && (
                        <p
                          className={`${active && 'text-white'}
                            text-xs group-hover:text-white text-textGray mt-1`}
                        >
                          {user.email}
                        </p>
                      )}
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
        {/* button */}
        <Button onClick={closeModal} label="Add" Icon={BiPlus} />
      </div>
    </Modal>
  );
}

export default PatientMedicineServiceModal;
