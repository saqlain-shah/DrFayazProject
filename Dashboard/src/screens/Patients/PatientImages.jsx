import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

function PatientImages({ images }) {
  console.log('Images prop:', images);

  if (!images || images.length === 0) {
    console.log('No images found');
    return <h1>No image found</h1>; // or return some placeholder UI indicating that no images are available
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {images.map((image, index) => {
        console.log('Image URL:', URL.createObjectURL(image));
        return (
          <div key={index} className="relative w-full">
            <img
              src={URL.createObjectURL(image)} // Use createObjectURL to display uploaded images
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
        );
      })}
    </div>
  );
}

export default PatientImages;
