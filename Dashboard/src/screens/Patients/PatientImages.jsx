import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';


function PatientImages({ images }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {images.map((image, index) => (
        <div key={index} className="relative w-full">
          <img
            src={`http://localhost:8800/${image}`} // Assuming image URL is provided correctly
            alt={`patient-${index}`}
            className="w-full h-72 rounded-lg object-cover"
          />
          <button
            onClick={() => toast.error('This feature is not available yet.')}
            className="bg-white rounded-full w-8 h-8 flex-colo absolute -top-1 -right-1"
          >
            <FaTimes className="text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default PatientImages;
