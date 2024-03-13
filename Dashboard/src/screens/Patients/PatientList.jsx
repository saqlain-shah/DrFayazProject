import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PatientList({ onSelectPatient, setSearchValue }) {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchValueInput, setSearchValueInput] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8800/api/patients', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchValueInput(value);
        setSearchValue(value);
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setSearchValueInput(patient.fullName);
        setSearchValue(patient.fullName);
        onSelectPatient(patient.fullName);
    };

    const filteredPatients = patients.filter(patient =>
        patient.fullName.toLowerCase().includes(searchValueInput.toLowerCase()) &&
        patient !== selectedPatient
    );


    return (
        <div className="border border-gray-300 rounded p-4 max-h-48 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Select Patient:</h2>
            <input
                type="text"
                placeholder="Search"
                value={searchValueInput}
                onChange={handleSearchChange}
                className="w-full border border-gray-300 rounded p-2 mb-2"
            />
            <ul>
                {filteredPatients.map(patient => (
                    <li key={patient.id} onClick={() => handlePatientSelect(patient)} className="cursor-pointer py-1 px-2 hover:bg-gray-100">
                        {patient.fullName}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PatientList;
