import React, { useState } from 'react';

function DentalChart() {

  const [seriousDisease, setSeriousDisease] = useState('');
  const [dentalConditions, setDentalConditions] = useState({
    cavity: false,
    gumDisease: false,
    toothDecay: false,
    // Add more dental condition fields as needed
  });
  const [lastCheckup, setLastCheckup] = useState('');
  const [nextCheckup, setNextCheckup] = useState('');
  const [mentalHealthIssues, setMentalHealthIssues] = useState([]);
  const [otherFields, setOtherFields] = useState({
    age: '',
    gender: '',
    bloodType: '',
    allergies: '',
    medications: ''
    // Add more fields as needed
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    setSeriousDisease(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setDentalConditions(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleMentalHealthChange = (event) => {
    const { value } = event.target;
    setMentalHealthIssues(prevState => [...prevState, value]);
  };

  const handleOtherFieldChange = (event) => {
    const { name, value } = event.target;
    setOtherFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLastCheckupChange = (event) => {
    setLastCheckup(event.target.value);
  };

  const handleNextCheckupChange = (event) => {
    setNextCheckup(event.target.value);
  };

  const handleSubmit = () => {
    // Validation
    const errors = {};
    if (!lastCheckup) {
      errors.lastCheckup = 'Last checkup date is required';
    }
    if (!nextCheckup) {
      errors.nextCheckup = 'Next checkup date is required';
    }
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Proceed with form submission
      console.log('Submitting Dental Chart data:', { seriousDisease, dentalConditions, lastCheckup, nextCheckup, mentalHealthIssues, otherFields });
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Dental Chart</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="seriousDisease" className="block text-sm font-medium text-gray-700">Serious Disease (if any)</label>
          <input type="text" id="seriousDisease" name="seriousDisease" value={seriousDisease} onChange={handleInputChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dental Conditions</label>
          <div className="mt-1 grid grid-cols-1 gap-4">
            <div className="flex items-start">
              <input id="cavity" name="cavity" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" onChange={handleCheckboxChange} />
              <label htmlFor="cavity" className="ml-3 text-sm font-medium text-gray-700">Cavity</label>
            </div>
            <div className="flex items-start">
              <input id="gumDisease" name="gumDisease" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" onChange={handleCheckboxChange} />
              <label htmlFor="gumDisease" className="ml-3 text-sm font-medium text-gray-700">Gum Disease</label>
            </div>
            <div className="flex items-start">
              <input id="toothDecay" name="toothDecay" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" onChange={handleCheckboxChange} />
              <label htmlFor="toothDecay" className="ml-3 text-sm font-medium text-gray-700">Tooth Decay</label>
            </div>
            <div className="flex items-start">
    <input id="gingivitis" name="gingivitis" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" onChange={handleCheckboxChange} />
    <label htmlFor="gingivitis" className="ml-3 text-sm font-medium text-gray-700">Gingivitis</label>
  </div>
  <div className="flex items-start">
    <input id="halitosis" name="halitosis" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" onChange={handleCheckboxChange} />
    <label htmlFor="halitosis" className="ml-3 text-sm font-medium text-gray-700">Halitosis</label>
  </div>
  <div className="flex items-start">
    <input id="oralCancer" name="oralCancer" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" onChange={handleCheckboxChange} />
    <label htmlFor="oralCancer" className="ml-3 text-sm font-medium text-gray-700">Oral Cancer</label>
  </div>
            {/* Add similar blocks for other dental conditions */}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="lastCheckup" className="block text-sm font-medium text-gray-700">Last Checkup</label>
        <input type="date" id="lastCheckup" name="lastCheckup" value={lastCheckup} onChange={handleLastCheckupChange} className={`mt-1 p-2 border ${errors.lastCheckup ? 'border-red-500' : 'border-gray-300'} block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
        {errors.lastCheckup && <p className="text-red-500 text-sm mt-1">{errors.lastCheckup}</p>}
      </div>
      <div className="mt-4">
        <label htmlFor="nextCheckup" className="block text-sm font-medium text-gray-700">Next Checkup</label>
        <input type="date" id="nextCheckup" name="nextCheckup" value={nextCheckup} onChange={handleNextCheckupChange} className={`mt-1 p-2 border ${errors.nextCheckup ? 'border-red-500' : 'border-gray-300'} block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
        {errors.nextCheckup && <p className="text-red-500 text-sm mt-1">{errors.nextCheckup}</p>}
      </div>
      <div className="mt-4">
        <label htmlFor="mentalHealth" className="block text-sm font-medium text-gray-700">Mental Health Issues</label>
        <select id="mentalHealth" name="mentalHealth" onChange={handleMentalHealthChange} multiple className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option value="Anxiety">Anxiety</option>
          <option value="Depression">Depression</option>
          <option value="Bipolar Disorder">Bipolar Disorder</option>
          {/* Add more mental health issues as options */}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
        <input type="text" id="age" name="age" value={otherFields.age} onChange={handleOtherFieldChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="mt-4">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
        <input type="text" id="gender" name="gender" value={otherFields.gender} onChange={handleOtherFieldChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="mt-4">
        <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Blood Type</label>
        <input type="text" id="bloodType" name="bloodType" value={otherFields.bloodType} onChange={handleOtherFieldChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="mt-4">
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
        <input type="text" id="allergies" name="allergies" value={otherFields.allergies} onChange={handleOtherFieldChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="mt-4">
        <label htmlFor="medications" className="block text-sm font-medium text-gray-700">Current Medications</label>
        <input type="text" id="medications" name="medications" value={otherFields.medications} onChange={handleOtherFieldChange} className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      {/* Add more fields as necessary */}
      <button onClick={handleSubmit} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">Submit</button>
    </div>
  );
}

export default DentalChart;
