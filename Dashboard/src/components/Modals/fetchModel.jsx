import React from 'react';
import moment from 'moment';

const AppointmentDetailsModal = ({ isOpen, closeModal, event, onDelete }) => {
    if (!isOpen || !event) return null;
    const renderDetails = () => {
        return Object.keys(event).map((key) => (
            <p key={key} className="mb-2">
                <span className="font-semibold">{key}:</span> {renderValue(event[key])}
            </p>
        ));
    };
    const renderValue = (value) => {
        if (moment.isDate(value)) {
            return moment(value).format('LLLL'); // Format Date objects using moment
        }
        if (typeof value === 'object' && value !== null) {
            return Object.entries(value).map(([key, val]) => (
                <p key={key} className="mb-2">
                    <span className="font-semibold">{key}:</span> {renderValue(val)}
                </p>
            ));
        }
        return value;
    };
    const handleDeleteClick = () => {
        onDelete(event.id); // Pass the id of the event to be deleted
        closeModal(); // Close the modal after deletion
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Appointment Details</h2>
                {renderDetails()} {/* Render all details */}
                <button
                    onClick={handleDeleteClick} // Handle delete button click
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none mr-2"
                >
                    Delete
                </button>
                <button
                    onClick={closeModal}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AppointmentDetailsModal;
