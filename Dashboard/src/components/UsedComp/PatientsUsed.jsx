import React, { useState, useEffect } from 'react';
import { PatientTable } from '../Tables';
import { useNavigate } from 'react-router-dom';

function PatientsUsed() {
  const navigate = useNavigate();
  const [patientsData, setPatientsData] = useState([]);
  const [token, setToken] = useState(''); // Assuming you have a token stored in state

  // Function to fetch data
  const fetchData = async () => {
    try {
      // Make an HTTP request to fetch data
      const response = await fetch('https://server-yvzt.onrender.com /api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`, // Add token to the request header
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setPatientsData(data); // Set the fetched data in state
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors, such as displaying a message to the user
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, [token]); // Fetch data whenever the token changes

  // Function to handle preview
  const preview = (id) => {
    navigate(`/patients/preview/${id}`);
  };

  return (
    <div className="w-full">
      <h1 className="text-sm font-medium mb-6">Patients</h1>
      <div className="w-full overflow-x-scroll">
        <PatientTable
          used={true}
          data={patientsData} // Use fetched data here
          functions={{
            preview: preview,
          }}
        />
      </div>
    </div>
  );
}

export default PatientsUsed;
