
import React, { useState } from 'react';

function DentalChart() {

  const [seriousDisease, setSeriousDisease] = useState('');
  const [dentalConditions, setDentalConditions] = useState({
    cavity: false,
    gumDisease: false,
    toothDecay: false,
    others: ''
  });
  const [lastCheckup, setLastCheckup] = useState('');
  const [nextCheckup, setNextCheckup] = useState('');

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

  const handleSubmit = () => {
    // You can perform actions like submitting the form data to a server here
    console.log('Submitting Dental Chart data:', { seriousDisease, dentalConditions, lastCheckup, nextCheckup });
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
              <div className="flex items-center h-5">
                <input id="cavity" name="cavity" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" onChange={handleCheckboxChange} />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="cavity" className="font-medium text-gray-700">Cavity</label>
              </div>
            </div>
            {/* Add similar blocks for other dental conditions */}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="lastCheckup" className="block text-sm font-medium text-gray-700">Last Checkup</label>
        <input type="date" id="lastCheckup" name="lastCheckup" value={lastCheckup} onChange={(e) => setLastCheckup(e.target.value)} className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="mt-4">
        <label htmlFor="nextCheckup" className="block text-sm font-medium text-gray-700">Next Checkup</label>
        <input type="date" id="nextCheckup" name="nextCheckup" value={nextCheckup} onChange={(e) => setNextCheckup(e.target.value)} className="mt-1 p-2 border border-gray-300 block w-full rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <button onClick={handleSubmit} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">Submit</button>
    </div>
  );
}

export default DentalChart;
