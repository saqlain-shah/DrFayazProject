import React, { useState, useEffect } from 'react';
import { PatientTable } from '../Tables';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../baseUrl.jsx';

function PatientsUsed() {
  const navigate = useNavigate();
  const [patientsData, setPatientsData] = useState([]);
  const [token, setToken] = useState('');
  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setPatientsData(data); // Set the fetched data in state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);
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
