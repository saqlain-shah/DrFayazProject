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
        <div className="border border-gray-300 rounded p-4 max-h-64 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Select Patient</h2>
            <input
                type="text"
                placeholder="Search by patient name"
                value={searchValueInput}
                onChange={handleSearchChange}
                className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none"
            />
            <ul className="divide-y divide-gray-200">
                {filteredPatients.map(patient => (
                    <li key={patient.id} onClick={() => handlePatientSelect(patient)} className="cursor-pointer py-2 px-4 hover:bg-gray-100 transition-colors">
                        <span className="block">{patient.fullName}</span>
                        <span className="block text-sm text-gray-500">{patient.email}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PatientList;
