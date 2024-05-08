import React, { useState, useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import axios from "axios";

function SenderReceverComp({
  item,
  functions,
  button,
  selectedPatient,
  handleSelectPatient
}) {
  const [patients, setPatients] = useState([]);
  const [showPatients, setShowPatients] = useState(false);

  useEffect(() => {
    if (showPatients) {
      // Fetch patients when showPatients state is true
      fetchPatients();
    }
  }, [showPatients]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://server-yvzt.onrender.com /api/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      // Handle error
    }
  };

  const handleAddButtonClick = () => {
    setShowPatients(true); // Show patients when "Add" button is clicked
  };

  const handlePatientSelect = (patient) => {
    handleSelectPatient(patient);
    setShowPatients(false); // Hide patients after selecting one
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6 items-center mt-4">
      <div className="border border-border rounded-xl p-5">
        <div className="flex-btn gap-4">
          <h1 className="text-md font-semibold">From:</h1>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <h6 className="text-xs font-medium">Dr Fayaz Clinic</h6>
          <p className="text-xs text-textGray">drfayaz@gmail.com</p>
          <p className="text-xs text-textGray">+ (92) 345,1111111</p>
        </div>
      </div>
      <div className="border border-border rounded-xl p-5">
        <div className="flex-btn gap-4">
          <h1 className="text-md font-semibold">To:</h1>
          {button && (
            <button
              onClick={handleAddButtonClick}
              className="bg-dry text-subMain flex-rows gap-2 rounded-lg border border-border py-2 px-4 text-sm"
            >
              <BiPlus /> Add
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          {showPatients ? (
            // Display list of patients if showPatients is true
            patients.map((patient) => {


              return (
                <div
                  key={patient._id} // Assuming _id is the unique identifier for the patient
                  className="cursor-pointer"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <h6 className="text-xs font-medium">{patient.fullName}</h6>
                  <p className="text-xs text-textGray">Email: {patient.email}</p>
                  <p className="text-xs text-textGray">Phone: {patient.emergencyContact}</p>
                </div>
              );
            })
          ) : selectedPatient ? (
            // Display selected patient data if available
            <>
              <h6 className="text-xs font-medium">{selectedPatient.fullName}</h6>
              <p className="text-xs text-textGray">Email: {selectedPatient.email}</p>
              <p className="text-xs text-textGray">Phone: {selectedPatient.emergencyContact}</p>
            </>
          ) : (
            // If no patient is selected, display default data
            <>
              <h6 className="text-xs font-medium">{item?.title}</h6>
              <p className="text-xs text-textGray">{item?.email}</p>
              <p className="text-xs text-textGray">{item?.phone}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SenderReceverComp;
