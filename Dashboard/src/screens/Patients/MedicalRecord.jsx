import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Form';
import { BiPlus } from 'react-icons/bi';
import { FiEye, FiEdit } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MedicalRecodModal from '../../components/Modals/MedicalRecodModal';
import EditMedicalRecordModal from './EditMedicalRecordModal'; // Import EditMedicalRecordModal
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { fetchMedicalRecords } from './fetch';
function MedicalRecord() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [medicineDosage, setMedicineDosage] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null); // Define selectedRecord state variable
  const navigate = useNavigate();
  const { id } = useParams();



  useEffect(() => {
    fetchMedicalRecords(id, setMedicalRecords, toast);
  }, [id]);

  const handleDelete = async (recordId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://server-yvzt.onrender.com/api/medical-records/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update medical records after deletion by passing the patient's id
      fetchMedicalRecords(id, setMedicalRecords, toast); // Pass id and setMedicalRecords function
      toast.success('Medical record deleted successfully');
    } catch (error) {
      console.error('Error deleting medical record:', error);
      toast.error('Failed to delete medical record');
    }
  };



  const handleEdit = async (recordId, newData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://server-yvzt.onrender.com/api/medical-records/${recordId}`, newData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMedicalRecords(); // Update medical records after editing
      toast.success('Medical record edited successfully');
    } catch (error) {
      console.error('Error editing medical record:', error);
      toast.error('Failed to edit medical record');
    }
  };



  return (
    <>
      {/* Modal */}
      {isOpen && (
        <MedicalRecodModal
          closeModal={() => {
            setIsOpen(false);
            setSelectedData(record);
            setMedicineDosage({ medicineDosage });
          }}
          isOpen={isOpen}
          data={{ ...selectedData, id }}
          token={localStorage.getItem('token')} // Include id in the data object
        />
      )}
      {isEditOpen && (
        <EditMedicalRecordModal
          closeModal={() => setIsEditOpen(false)}
          isOpen={isEditOpen}
          selectedData={selectedRecord}
          handleEdit={(recordId, newData) => handleEdit(recordId, newData)}  // Pass recordId to handleEdit
        />

      )}
      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-4">
          <h1 className="text-sm font-medium sm:block hidden">Medical Records</h1>
          <div className="sm:w-1/4 w-full">
            <Button
              label="New Record"
              Icon={BiPlus}
              onClick={() => {
                navigate(`/patients/visiting/${id}`);
              }}
            />
          </div>
        </div>

        {/* Medical Records */}
        {medicalRecords.map((record) => (
          <div
            key={record.id}
            className="bg-dry items-start grid grid-cols-12 gap-4 rounded-xl border-[1px] border-border p-6"
          >
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs text-textGray font-medium">{new Date(record.createdAt).toLocaleString()}</p>
            </div>

            <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
              {record.data?.map((item) => (
                <p key={item.id} className="text-xs text-main font-light">
                  <span className="font-medium">{item.title}:</span>{' '}
                  {item.value.length > 40 ? `${item.value.slice(0, 40)}...` : item.value}
                </p>
              ))}

              {record.complaints && (
                <p className="text-xs text-main font-light">
                  <span className="font-medium">Complaints:</span> {record.complaints.join(', ')}
                </p>
              )}

              {record.diagnosis && (
                <p className="text-xs text-main font-light">
                  <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                </p>
              )}

              {record.vitalSigns && (
                <p className="text-xs text-main font-light">
                  <span className="font-medium">Vital Signs:</span> {record.vitalSigns.join(', ')}
                </p>
              )}

              {record.treatment && (
                <p className="text-xs text-main font-light">
                  <span className="font-medium">Treatment:</span> {record.treatment.join(', ')}
                </p>
              )}

            </div>

            <div className="col-span-12 md:col-span-2">
              <p className="text-xs text-subMain font-semibold">
                <span className="font-light text-main">(Tsh)</span> {record.amount}
              </p>
            </div>

            <div className="col-span-12 md:col-span-2 flex-rows gap-2">
              <button
                onClick={() => {
                  setIsOpen(true);
                  setSelectedData(record); // Use record here
                }}
                className="text-sm flex-colo bg-white text-subMain border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <FiEye />
              </button>
              <button
                onClick={() => {
                  setIsEditOpen(true);
                  setSelectedRecord(record); // Pass selected record to modal
                }}
                className="text-sm flex-colo bg-white text-yellow-600 border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <FiEdit />
              </button>

              <button
                onClick={() => handleDelete(record._id)}
                className="text-sm flex-colo bg-white text-red-600 border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <RiDeleteBin6Line />
              </button>

            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MedicalRecord;
