import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Link } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { PatientTable } from '../../components/Tables';
import axios from 'axios';
import DatePicker from "react-datepicker"; // Import the date picker component
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for the date picker
import AddEditPatientModal  from './EditPatient';
function Patients() {
  const [isOpen, setIsOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null); // State for the start date filter

  const fetchPatients = async () => {
    try {
        const token = localStorage.getItem('token');
        const formattedDate = startDate ? startDate.toLocaleDateString('en-US') : ''; // Format selected date as MM/DD/YYYY
        const response = await axios.get('http://localhost:8800/api/patients', {
            params: { search: searchQuery, startDate: formattedDate }, // Include the formatted date
            headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(response.data);
    } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to fetch patients');
    }
};


  useEffect(() => {
    fetchPatients(); // Call fetchPatients function on component mount and when dependencies change
  }, [searchQuery, startDate]);


  const handleDelete = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8800/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const response = await axios.get('http://localhost:8800/api/patients', {
        params: { search: searchQuery, startDate }, // Include the startDate parameter
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
      toast.success('Patient deleted successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  };



  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsOpen(true);
  };

  const handleSavePatient = async (patientData) => {
    try {
      const token = localStorage.getItem('token');
      if (patientData._id) {
        // If patient already exists, update it
        await axios.put(`http://localhost:8800/api/patients/${patientData._id}`, patientData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Patient updated successfully');
      } else {
        // Otherwise, create a new patient
        await axios.post('http://localhost:8800/api/patients', patientData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Patient created successfully');
      }
      fetchPatients(); // Refresh patient data after save
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error('Failed to save patient');
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedPatient(null);
  }
  return (
    <Layout>
      <Link
        to="/patients/create"
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </Link>
      <h1 className="text-xl font-semibold">Patients</h1>
      <div className="bg-white my-8 rounded-xl border-[1px] border-border p-5">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder='Search "Patients"'
              className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1">
            {/* Date Picker */}
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={startDate}
              placeholderText="Select start date"
              className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4"
            />
          </div>
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <PatientTable
            data={patients}
            onEdit={handleEdit} 
            functions={{ delete: handleDelete }}
          />
        </div>
      </div>
      <AddEditPatientModal
        isOpen={isOpen}
        closeModal={handleCloseModal}
        patientData={selectedPatient}
        onSave={handleSavePatient}
      />
    </Layout>
  );
}

export default Patients;
