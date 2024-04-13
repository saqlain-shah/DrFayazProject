// Inside Patients.jsx

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

function Patients() {
  const [isOpen, setIsOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [genderFilter, setGenderFilter] = useState("all"); // State for selected gender filter
  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedDate = startDate ? startDate.toLocaleDateString('en-US') : '';
      const response = await axios.get('https://drfayazproject.onrender.com/api/patients', {
        params: { search: searchQuery, startDate: formattedDate, gender: genderFilter },
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log('Fetched patients:', response.data);
  
      // Iterate over patients to fetch appointment details
      const patientsWithAppointments = await Promise.all(response.data.map(async (patient) => {
        const appointments = await Promise.all(patient.appointments.map(async (id) => {
          console.log(`Fetching appointment details for appointment ID: ${id}`);
          const appointmentResponse = await axios.get(`http://localhost:8800/api/web/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`Fetched appointment details for appointment ID: ${id}`, appointmentResponse.data);
          return appointmentResponse.data;
        }));
        return { ...patient, appointments };
      }));
  
      console.log('Patients with appointments:', patientsWithAppointments);
      setPatients(patientsWithAppointments);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients');
    }
  };
  
  useEffect(() => {
    fetchPatients();
  }, [searchQuery, startDate, genderFilter]);
  
  
  
  

  useEffect(() => {
    fetchPatients();
  }, [searchQuery, startDate, genderFilter]);

  const handleDelete = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://drfayazproject.onrender.com/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPatients();
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
        await axios.put(`https://drfayazproject.onrender.com/api/patients/${patientData._id}`, patientData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Patient updated successfully');
      } else {
        await axios.post('https://drfayazproject.onrender.com/api/patients', patientData, {
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

  const handleGenderFilterChange = (event) => {
    const selectedValue = event.target.value;
    setGenderFilter(selectedValue);
  };

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
              className="h-14 text-sm text-main rounded-md bg-dry border border-border px-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-grow md:w-auto w-full">
            <select
              value={genderFilter}
              onChange={handleGenderFilterChange}
              className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4 w-full"
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
              className="h-14 text-sm text-main rounded-md bg-dry border border-border px-6 w-full"
            />
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
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
