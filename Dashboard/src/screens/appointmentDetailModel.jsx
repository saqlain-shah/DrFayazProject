import React from 'react';
import Modals from './Modals';

const AppointmentDetailsModal = ({ isOpen, closeModal, event, onDelete }) => {
    // If the modal is not open or event data is not available, return null to not render anything
    if (!isOpen || !event) return null;

    const handleDelete = () => {
        // Call the onDelete function and pass the event ID
        onDelete(event.id);
    };

    return (
        <Modals isOpen={isOpen} onClose={closeModal}>
            {/* Modal container */}
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                {/* Modal header */}
                <div className="px-4 py-2 flex justify-between items-center bg-gray-200">
                    <h2 className="text-lg font-semibold">Appointment Details</h2>
                    {/* Close button */}
                    <button
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={closeModal}
                    >
                        {/* Close icon */}
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {/* Modal content */}
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            {/* Display appointment details */}
                            <p><strong>Title:</strong> {event.title}</p>
                            <p><strong>Start:</strong> {event.start?.toLocaleString()}</p>
                            <p><strong>End:</strong> {event.end?.toLocaleString()}</p>
                        </div>
                        <div>
                            {/* Additional appointment details */}
                            <p><strong>Service:</strong> {event.selectedService?.name}</p>
                            <p><strong>Price:</strong> {event.selectedService?.price}</p>
                            <p><strong>Patient Name:</strong> {event.patientInfo?.name}</p>
                            <p><strong>Patient Email:</strong> {event.patientInfo?.email}</p>
                            <p><strong>Emergency Contact:</strong> {event.patientInfo?.emergencyContact}</p>
                            <p><strong>Address:</strong> {event.patientInfo?.address}</p>
                            <p><strong>Blood Group:</strong> {event.patientInfo?.bloodGroup}</p>
                            <p><strong>Gender:</strong> {event.patientInfo?.gender}</p>
                            {/* You can add more appointment details here */}
                            {/* Delete button */}
                            {/* <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                                onClick={handleDelete}
                            >
                                Delete
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </Modals>
    );
};

export default AppointmentDetailsModal;
