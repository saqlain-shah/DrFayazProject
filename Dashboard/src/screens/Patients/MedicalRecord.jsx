import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Form';
import { BiPlus } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MedicalRecodModal from '../../components/Modals/MedicalRecodModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MedicalRecord() {
  const [isOpen, setIsOpen] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedData, setSelectedData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the authentication token from storage
      const response = await axios.get('http://localhost:8800/api/medical-records', {
        headers: { Authorization: `Bearer ${token}` } // Include the token in the request headers
      });
      console.log('Fetched medical records:', response.data.data);
      setMedicalRecords(response.data.data.map(record => ({
        ...record,
        treatment: record.treatment.map(t => t.name) // Assuming `treatment` is an array of objects
      })));
    } catch (error) {
      console.error('Error fetching medical records:', error);
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
          }}
          isOpen={isOpen}
          data={selectedData}
        />
      )}

      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-4">
          <h1 className="text-sm font-medium sm:block hidden">Medical Record</h1>
          <div className="sm:w-1/4 w-full">
            <Button
              label="New Record"
              Icon={BiPlus}
              onClick={() => {
                navigate(`/patients/visiting/2`);
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
                  setSelectedData(record);
                }}
                className="text-sm flex-colo bg-white text-subMain border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <FiEye />
              </button>
              <button
                onClick={() => {
                  toast.error('This feature is not available yet');
                }}
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
