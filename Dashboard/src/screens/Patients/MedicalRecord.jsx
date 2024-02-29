import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Form';
import { BiPlus } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MedicalRecodModal from '../../components/Modals/MedicalRecodModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function MedicalRecord() {
  const [isOpen, setIsOpen] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedData, setSelectedData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch medical records from the backend when the component mounts
    fetchMedicalRecords();
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/medical-records');
      console.log('Fetched medical records:', response.data.data); // Log fetched data
      setMedicalRecords(response.data.data);
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
            setSelectedData(record); // Pass the entire record as selected data
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
              <p className="text-xs text-textGray font-medium">{record.date}</p>
            </div>

            <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
              {/* Rendering data */}
              {medicalRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-dry items-start grid grid-cols-12 gap-4 rounded-xl border-[1px] border-border p-6"
                >
                  <div className="col-span-12 md:col-span-2">
                    <p className="text-xs text-textGray font-medium">{record.date}</p>
                  </div>

                  <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                    {/* Rendering data */}
                    {record.data?.map((item) => (
                      <p key={item.id} className="text-xs text-main font-light">
                        <span className="font-medium">{item.title}:</span>{' '}
                        {item.value.length > 40 ? `${item.value.slice(0, 40)}...` : item.value}
                      </p>
                    ))}

                    {/* Render complaints */}
                    {record.complaints && (
                      <p className="text-xs text-main font-light">
                        <span className="font-medium">Complaints:</span> {record.complaints.join(', ')}
                      </p>
                    )}

                    {/* Render diagnosis */}
                    {record.diagnosis && (
                      <p className="text-xs text-main font-light">
                        <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                      </p>
                    )}

                    {/* Render vital signs */}
                    {record.vitalSigns && (
                      <p className="text-xs text-main font-light">
                        <span className="font-medium">Vital Signs:</span> {record.vitalSigns.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-span-12 md:col-span-2">
                    <p className="text-xs text-subMain font-semibold">
                      <span className="font-light text-main">(Tsh)</span> {record.amount}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            {/* Price */}
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs text-subMain font-semibold">
                <span className="font-light text-main">(Tsh)</span> {record.amount}
              </p>
            </div>

            {/* Actions */}
            <div className="col-span-12 md:col-span-2 flex-rows gap-2">
              {/* View Record */}
              <button
                onClick={() => {
                  setIsOpen(true);
                  setSelectedData(record); // Pass the entire record as selected data
                }}
                className="text-sm flex-colo bg-white text-subMain border border-border rounded-md w-2/4 md:w-10 h-10"
              >
                <FiEye />
              </button>

              {/* Delete Record */}
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
