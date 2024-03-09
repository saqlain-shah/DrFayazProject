import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { sortsDatas } from '../../components/Datas';
import { Link, useNavigate } from 'react-router-dom';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { MdFilterList } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { Button, FromToDate, Select } from '../../components/Form';
import { PatientTable } from '../../components/Tables';
import axios from 'axios';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [gender, setGender] = useState(sortsDatas.genderFilter[0]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [sortBy, setSortBy] = useState('new'); // State for sorting
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log('Gender state before fetching patients:', gender); // Log the gender state before making the API request

    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the authentication token from storage
        const response = await axios.get('http://localhost:8800/api/patients', {
          params: { search: searchQuery, gender: gender.value, sortBy },
          headers: { Authorization: `Bearer ${token}` } // Include the token in the request headers
        });
        console.log('Received patients:', response.data);
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to fetch patients');
      }
    };

    fetchPatients();
  }, [searchQuery, gender, sortBy]);


  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender.value); // Update to set the gender value
  };

  const handleDelete = async (patientId) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the authentication token from storage
      // Make an API call to delete the patient with the provided ID and include the token in the headers
      await axios.delete(`http://localhost:8800/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refetch the patients after deletion
      const response = await axios.get('http://localhost:8800/api/patients', {
        params: { search: searchQuery, gender: gender.value, sortBy },
        headers: { Authorization: `Bearer ${token}` } // Include the token in the request headers
      });
      setPatients(response.data);
      toast.success('Patient deleted successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  };



  // Function to handle sorting change
  const handleSortChange = (value) => {
    // Toggle between 'new' and 'old' when the same option is clicked again
    const newSortBy = sortBy === 'new' ? 'old' : 'new';
    setSortBy(newSortBy);
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
        <div className="grid lg:grid-cols-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder='Search "Patients"'
            className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            selectedPerson={gender}
            setSelectedPerson={handleGenderChange}
            datas={[
              { name: 'All', value: '' }, // Option for showing all patients
              ...sortsDatas.genderFilter
            ]}
          >

            <div className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between">
              <p>{gender.name}</p>
              <BiChevronDown className="text-xl" />
            </div>
          </Select>
          <FromToDate
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            bg="bg-dry"
            onChange={(update) => setDateRange(update)}
          />
          <Select
            selectedPerson={sortBy}
            setSelectedPerson={handleSortChange}
            datas={[
              { name: 'Newest First', value: 'new' },
              { name: 'Oldest First', value: 'old' },
            ]}
          >
            <div className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between">
              {sortBy === 'new' ? 'Newest First' : 'Oldest First'} <BiChevronDown className="text-xl" />
            </div>
          </Select>
          <Button
            label="Filter"
            Icon={MdFilterList}
            onClick={() => {
              toast.error('Filter data is not available yet');
            }}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <PatientTable
            data={patients}
            functions={{ delete: handleDelete }}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Patients;
