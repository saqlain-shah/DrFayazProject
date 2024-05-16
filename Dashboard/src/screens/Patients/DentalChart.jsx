import React, { useState, useEffect } from 'react';
import { BiPlus, BiTrash } from 'react-icons/bi';
import { Button, Checkbox, Input } from '../../components/Form';
import axios from 'axios';
import DentalChartTable from './DentalChartTable';
import { useParams } from 'react-router-dom'; // Add this import

function DentalChart() {
  const { id } = useParams();
  const [seriousDisease, setSeriousDisease] = useState('');
  const [dentalConditions, setDentalConditions] = useState([
    { name: 'cavity', checked: false },
    { name: 'gumDisease', checked: false },
    { name: 'toothDecay', checked: false },
    { name: 'gingivitis', checked: false },
    { name: 'halitosis', checked: false },
    { name: 'oralCancer', checked: false }
  ]);
  const [mentalHealthIssues, setMentalHealthIssues] = useState(['Anxiety', 'Depression', 'Bipolar Disorder']);
  const [otherFields, setOtherFields] = useState({
    allergies: '',
    medications: ''
  });
  const [newDentalCondition, setNewDentalCondition] = useState('');
  const [newMentalHealthIssue, setNewMentalHealthIssue] = useState('');
  const [submittedData, setSubmittedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8800/api/dental-chart/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSubmittedData([response.data]);
      } catch (error) {
        console.error('Error:', error);
        console.error('Error message:', error.response.data);
      }
    };

    // Fetch data only if submittedData is empty
    if (submittedData.length === 0) {
      fetchData();
    }
  }, [id, submittedData]); // Include submittedData in dependency array

  const handleInputChange = (event) => {
    setSeriousDisease(event.target.value);
  };

  const handleCheckboxChange = (index) => {
    const newConditions = [...dentalConditions];
    newConditions[index].checked = !newConditions[index].checked;
    setDentalConditions(newConditions);
  };

  const handleMentalHealthChange = (event) => {
    const { value } = event.target;
    setMentalHealthIssues((prevState) => [...prevState, value]);
  };

  const handleOtherFieldChange = (event) => {
    const { name, value } = event.target;
    setOtherFields((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8800/api/dental-chart/',
        {
          seriousDisease,
          dentalConditions: dentalConditions.filter(condition => condition.checked).map(condition => condition.name),
          mentalHealthIssues,
          ...otherFields
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSubmittedData((prevData) => [...prevData, response.data]);
      setSeriousDisease('');
      setDentalConditions([
        { name: 'cavity', checked: false },
        { name: 'gumDisease', checked: false },
        { name: 'toothDecay', checked: false },
        { name: 'gingivitis', checked: false },
        { name: 'halitosis', checked: false },
        { name: 'oralCancer', checked: false }
      ]);
      setMentalHealthIssues(['Anxiety', 'Depression', 'Bipolar Disorder']);
      setOtherFields({
        allergies: '',
        medications: ''
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8800/api/dental-chart/${id.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubmittedData((prevData) => prevData.filter(data => data._id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addNewCondition = () => {
    if (newDentalCondition.trim() === '') return;
    setDentalConditions((prevState) => [
      ...prevState,
      { name: newDentalCondition.toLowerCase(), checked: true }
    ]);
    setNewDentalCondition('');
  };

  const removeCondition = (index) => {
    const newConditions = [...dentalConditions];
    newConditions.splice(index, 1);
    setDentalConditions(newConditions);
  };

  const addNewMentalHealthIssue = () => {
    if (newMentalHealthIssue.trim() === '') return;
    setMentalHealthIssues((prevState) => [...prevState, newMentalHealthIssue]);
    setNewMentalHealthIssue('');
  };

  const removeMentalHealthIssue = (index) => {
    const newIssues = [...mentalHealthIssues];
    newIssues.splice(index, 1);
    setMentalHealthIssues(newIssues);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-md">

      <h2 className="text-lg font-semibold mb-4">Dental Chart</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="seriousDisease" className="block text-sm font-medium text-gray-700">
            Serious Disease (if any)
          </label>
          <input
            type="text"
            id="seriousDisease"
            name="seriousDisease"
            value={seriousDisease}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dental Conditions</label>
          <div className="mt-1 grid grid-cols-1 gap-4">
            {dentalConditions.map((condition, index) => (
              <div className="flex items-start" key={index}>
                <Checkbox
                  id={condition.name}
                  name={condition.name}
                  checked={condition.checked}
                  onChange={() => handleCheckboxChange(index)}
                />
                <label htmlFor={condition.name} className="ml-3 text-sm font-medium text-gray-700">
                  {condition.name.charAt(0).toUpperCase() + condition.name.slice(1)}
                </label>
                <button onClick={() => removeCondition(index)} className="ml-2 text-red-500">
                  <BiTrash />
                </button>
              </div>
            ))}
            <div className="flex items-start">
              <input
                type="text"
                value={newDentalCondition}
                onChange={(e) => setNewDentalCondition(e.target.value)}
                placeholder="Add new condition"
                className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={addNewCondition}
                className="ml-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
              >
                <BiPlus />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="mentalHealth" className="block text-sm font-medium text-gray-700">
          Mental Health Issues
        </label>
        <table className="mt-1 w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Issue</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {mentalHealthIssues.map((issue, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{issue}</td>
                <td className="border px-4 py-2 text-right">
                  <button onClick={() => removeMentalHealthIssue(index)} className="text-red-500">
                    <BiTrash />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={newMentalHealthIssue}
                  onChange={(e) => setNewMentalHealthIssue(e.target.value)}
                  placeholder="Add new issue"
                  className="p-1 border border-gray-300 w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </td>
              <td className="border px-4 py-2 text-right">
                <button
                  onClick={addNewMentalHealthIssue}
                  className="bg-indigo-600 text-white py-1 px-2 rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  <BiPlus />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
            Allergies
          </label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            value={otherFields.allergies}
            onChange={handleOtherFieldChange}
            className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="medications" className="block text-sm font-medium text-gray-700">
            Current Medications
          </label>
          <input
            type="text"
            id="medications"
            name="medications"
            value={otherFields.medications}
            onChange={handleOtherFieldChange}
            className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
      >
        Submit
      </button>
      <table className="table-auto w-full mt-4">
        <thead className="bg-dry rounded-md overflow-hidden">
          <tr>
            <th className="text-start text-xs font-medium py-3 px-2 whitespace-nowrap">Serious Disease</th>
            <th className="text-start text-xs font-medium py-3 px-2 whitespace-nowrap">Dental Conditions</th>
            <th className="text-start text-xs font-medium py-3 px-2 whitespace-nowrap">Mental Health Issues</th>
            <th className="text-start text-xs font-medium py-3 px-2 whitespace-nowrap">Allergies</th>
            <th className="text-start text-xs font-medium py-3 px-2 whitespace-nowrap">Medications</th>
            <th className="text-start text-xs font-medium py-3 px-2 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.map((data) => (
            <DentalChartTable key={data._id} data={data} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DentalChart;