// EditMedicalRecordModal.js
import React, { useState } from 'react';
import Modal from '../../components/Modals/Modal';
import { Button, Input, Textarea } from '../../components/Form';

function EditMedicalRecordModal({ closeModal, isOpen, selectedData, handleEdit }) {
    const [complaints, setComplaints] = useState(selectedData.complaints);
    const [diagnosis, setDiagnosis] = useState(selectedData.diagnosis);
    const [vitalSigns, setVitalSigns] = useState(selectedData.vitalSigns);


    const handleSubmit = () => {
        handleEdit(selectedData._id, { complaints, diagnosis, vitalSigns }); // Include treatment in the edited data
        closeModal();
    };

    return (
        <Modal closeModal={closeModal} isOpen={isOpen} width={'max-w-xl'}>
            <div className="flex-colo gap-6">
                <Textarea
                    label="Complaints"
                    color={true}
                    rows={3}
                    value={complaints}
                    onChange={(e) => setComplaints(e.target.value)}
                />
                <Textarea
                    label="Diagnosis"
                    color={true}
                    rows={3}
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                />
                <Textarea
                    label="Vital Signs"
                    color={true}
                    rows={3}
                    value={vitalSigns}
                    onChange={(e) => setVitalSigns(e.target.value)}
                />
                {/* Checkbox input for Treatment */}

                <Button label="Save Changes" onClick={handleSubmit} />
            </div>
        </Modal>
    );
}

export default EditMedicalRecordModal;
