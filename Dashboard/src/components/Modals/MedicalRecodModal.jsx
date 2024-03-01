import React from 'react';
import Modal from './Modal';
import { Button } from '../Form';
import { FiEye } from 'react-icons/fi';
import { MedicineDosageTable } from '../../components/Tables'
function MedicalRecodModal({ closeModal, isOpen, data }) {
  // Destructure the data prop to access prescription and attachments
  const { medicineDosages, attachments } = data;
  console.log("datass", data)
  console.log("medicineDosages", medicineDosages);


  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      data={data}
      title="12 May 2021"
      width={'max-w-4xl'}
    >
      <div className="flex-colo gap-6">
        {/* Render prescription items */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Prescriptions</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <MedicineDosageTable data={medicineDosages} />
          </div>
        </div>
        {/* Render Attachments */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Attachments:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6 xs:grid-cols-2 md:grid-cols-4 grid gap-4">
            {/* Render attachment images */}
            {attachments.map((attachment, index) => (
              <img
                key={index}
                src={`http://localhost:8800/${attachment}`}
                alt={`Attachment ${index}`}
                className="w-full md:h-32 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
        {/* View Invoice */}
        <div className="flex justify-end items-center w-full">
          <div className="md:w-3/4 w-full">
            <Button
              label="View Invoice"
              Icon={FiEye}
            // onClick={/* Handle View Invoice click */}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default MedicalRecodModal;
