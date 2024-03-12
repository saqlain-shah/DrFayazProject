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
          <label htmlFor="seriousDisease" className="block text-sm font-medium text-gray-700">Serious Disease:</label>
          <input
            type="text"
            id="seriousDisease"
            value={seriousDisease}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter serious disease"
          />
        </div>
        <div>
          <label htmlFor="lastCheckup" className="block text-sm font-medium text-gray-700">Last Checkup:</label>
          <input
            type="date"
            id="lastCheckup"
            value={lastCheckup}
            onChange={(e) => setLastCheckup(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label htmlFor="nextCheckup" className="block text-sm font-medium text-gray-700">Next Checkup:</label>
          <input
            type="date"
            id="nextCheckup"
            value={nextCheckup}
            onChange={(e) => setNextCheckup(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-2">Dental Conditions:</h3>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="cavity"
              checked={dentalConditions.cavity}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-sm text-gray-700">Cavity</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="checkbox"
              name="gumDisease"
              checked={dentalConditions.gumDisease}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-sm text-gray-700">Gum Disease</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="checkbox"
              name="toothDecay"
              checked={dentalConditions.toothDecay}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-sm text-gray-700">Tooth Decay</span>
          </label>
          <div className="mt-2">
            <label htmlFor="others" className="block text-sm font-medium text-gray-700">Others:</label>
            <input
              type="text"
              id="others"
              value={dentalConditions.others}
              onChange={(event) => setDentalConditions({ ...dentalConditions, others: event.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter other conditions"
            />
          </div>
        </div>
      </div>
      <button onClick={handleSubmit} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">Submit</button>
    </div>
  );
}

export default DentalChart;
