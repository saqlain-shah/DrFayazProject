import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PatientDetails({ patientId }) {
    console.log("patientId",patientId)
  const [patientDetails, setPatientDetails] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8800/api/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatientDetails(response.data);
      } catch (error) {
        setError('Error fetching patient details.');
        console.error('Error fetching patient details:', error);
      }
    };

    const fetchMedicalRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8800/api/medical-records/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMedicalRecords(response.data);
      } catch (error) {
        setError('Error fetching medical records.');
        console.error('Error fetching medical records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
    fetchMedicalRecords();
  }, [patientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Patient Details</h2>
      <div>
        <p>Name: {patientDetails.fullName}</p>
        <p>Email: {patientDetails.email}</p>
        {/* Render other patient details here */}
      </div>
      <h2>Medical Records</h2>
      <ul>
        {medicalRecords.map(record => (
          <li key={record.id}>
            <p>Date: {record.date}</p>
            <p>Doctor: {record.doctor}</p>
            {/* Render other medical record details here */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientDetails;
