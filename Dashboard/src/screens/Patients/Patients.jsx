import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Link } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { PatientTable } from '../../components/Tables';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddEditPatientModal from './EditPatient';
import { useParams } from 'react-router-dom';

function Patients() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [webPatients, setWebPatients] = useState([]); // Changed appointments to webPatients
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [genderFilter, setGenderFilter] = useState("all"); // State for selected gender filter
  const { patientId } = useParams();

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedDate = startDate ? startDate.toLocaleDateString('en-US') : '';
      const response = await axios.get('http://localhost:8800/api/patients', {
        params: { search: searchQuery, startDate: formattedDate, gender: genderFilter },
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients');
    }
  };
  
  const fetchWebPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const webPatientsResponse = await axios.get(`http://localhost:8800/api/web/`, {
        params: { gender: genderFilter }, // Add gender filter parameter
        headers: { Authorization: `Bearer ${token}` }
      });
      const uniqueWebPatients = webPatientsResponse.data.filter((patient, index, self) =>
        index === self.findIndex((p) => (
          p.patientInfo.email === patient.patientInfo.email
        ))
      );
      setWebPatients(uniqueWebPatients);
    } catch (error) {
      console.error('Error fetching webPatients:', error);
      toast.error('Failed to fetch webPatients');
    }
  };
  

  useEffect(() => {
    fetchPatients();
    fetchWebPatients(); // Changed fetchAppointments to fetchWebPatients
  }, [searchQuery, startDate, genderFilter]);

  const handleDelete = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8800/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove the deleted patient from the patients state
      setPatients(patients.filter(patient => patient._id !== patientId));
      toast.success('Patient deleted successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  };

  const handleDeleteWebPatient = async (webPatientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8800/api/web/${webPatientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove the deleted web patient from the webPatients state
      setWebPatients(webPatients.filter(patient => patient._id !== webPatientId));
      toast.success('Web patient deleted successfully');
    } catch (error) {
      console.error('Error deleting web patient:', error);
      toast.error('Failed to delete web patient');
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
        await axios.put(`http://localhost:8800/api/patients/${patientData._id}`, patientData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Patient updated successfully');
      } else {
        await axios.post('http://localhost:8800/api/patients', patientData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Patient created successfully');
      }
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error('Failed to save patient');
    }
  };



  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedPatient(null);
  };

// Inside the Patients component

const handleGenderFilterChange = (event) => {
  const selectedValue = event.target.value.toLowerCase(); // Convert to lowercase
  console.log('Selected gender filter:', selectedValue); // Log the selected value
  setGenderFilter(selectedValue);
};


// Select component in the render method



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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="flex-grow md:w-auto w-full">
            <input
              type="text"
              placeholder='Search "Patients"'
              className="h-14 text-sm text-main rounded-md bg-dry border border-border px-20 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-grow md:w-auto w-full">
          <select
  value={genderFilter}
  onChange={handleGenderFilterChange}
  className="h-14 text-sm text-main rounded-md bg-dry border border-border px-20 w-full"
>
  <option value="all">All</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
</select>
          </div>
          <div className="flex-grow w-full md:w-auto">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={startDate}
              placeholderText="Select start date"
              className="h-14 text-sm text-main rounded-md bg-dry border border-border px-20 w-full"
            />
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <PatientTable
            patients={patients}
            webPatients={webPatients} // Changed appointments to webPatients
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDeleteWebPatient={handleDeleteWebPatient}
            onSavePatient={handleSavePatient}
          />
        </div>
      </div>




      <AddEditPatientModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        patientData={selectedPatient}
        onSave={handleSavePatient}
      />
    </Layout>
  );
}

export default Patients;