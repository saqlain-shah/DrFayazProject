import React, { useState } from 'react';
import Modal from 'react-modal';

const ContactSelectionDialog = ({ contacts, isOpen, onClose, message }) => {
    const [selectedContact, setSelectedContact] = useState({
        name: "",
        phoneNumber: "", // Updated to empty string
        email: ""
    });

    const [searchQuery, setSearchQuery] = useState('');

    const handleContactSelect = (contact) => {
        console.log('Contact selected:', contact);
        if (contact) {
            if (contact.phoneNumber) {
                const whatsappUrl = `https://wa.me/${contact.phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            } else if (contact.email) {
                const subject = encodeURIComponent("Check out this campaign");
                const gmailUrl = `mailto:${contact.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
                window.location.href = gmailUrl;
            }
            onClose(); // Close dialog after action
        }
    };



    const handleClose = () => {
        // Close the dialog and pass the selected contact if available
        setSelectedContact({
            name: "",
            phoneNumber: 0,
            email: ""

        })
        onClose();
    };

    // Filter contacts based on searchQuery
   // Filter contacts based on searchQuery
const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase())
);


    return (
        <Modal isOpen={isOpen} className="p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-20">
            <h2 className="text-xl font-semibold mb-4">Select Contact</h2>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring focus:border-blue-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 15.5L20 20" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 10.5C17 13.5376 14.5376 16 11.5 16C8.46243 16 6 13.5376 6 10.5C6 7.46243 8.46243 5 11.5 5C14.5376 5 17 7.46243 17 10.5Z" />
                    </svg>
                </span>
            </div>
            <div>
                {filteredContacts.map((contact, index) => (
                    <div key={index} onClick={() => handleContactSelect(contact)} className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 mb-2">
                        <p className="text-gray-800">{contact.name}</p>
                        {contact.phoneNumber && <p className="text-gray-600 text-sm">{contact.phoneNumber}</p>}
                        {contact.email && <p className="text-gray-600 text-sm">{contact.email}</p>}
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-4">
                <button className='bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700' onClick={handleClose}>Close</button>
            </div>
        </Modal>


    );
};
export default ContactSelectionDialog;



