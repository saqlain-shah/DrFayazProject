import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from '../Form';
import { FiEye } from 'react-icons/fi';
import { MedicineDosageTable } from '../../components/Tables';

function MedicalRecodModal({ closeModal, isOpen, data }) {
  const { prescription, attachments, complaints, diagnosis, vitalSigns, treatment } = data;
  const [showMedicineDosages, setShowMedicineDosages] = useState(false);
  const medicineDosages = prescription ? prescription.medicines : [];

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      data={data}
      title={new Date(data.createdAt).toLocaleString()}
      width={'max-w-4xl'}
    >
      <div className="flex-colo gap-6">
        {/* Render prescription items if available */}
        {medicineDosages.length > 0 && (
          <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-12 md:col-span-3">
              <p className="text-sm font-medium">Prescriptions</p>
            </div>
            <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
              {showMedicineDosages && <MedicineDosageTable data={medicineDosages} />}
            </div>
          </div>
        )}

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

        {/* Render Complaints */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Complaints:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p>{complaints}</p>
          </div>
        </div>

        {/* Render Diagnosis */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Diagnosis:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p>{diagnosis}</p>
          </div>
        </div>

        {/* Render Vital Signs */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Vital Signs:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p>{vitalSigns}</p>
          </div>
        </div>

        {/* Render Treatment */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Treatment:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p>{treatment}</p>
          </div>
        </div>

        {/* Render eye icon to toggle MedicineDosageTable */}
        <div className="flex items-center justify-end">
          <FiEye
            className="cursor-pointer mr-2"
            onClick={() => setShowMedicineDosages(!showMedicineDosages)}
          />
          <p>Show Medicine Dosages</p>
        </div>
      </div>
    </Modal>
  );
}

export default MedicalRecodModal;
