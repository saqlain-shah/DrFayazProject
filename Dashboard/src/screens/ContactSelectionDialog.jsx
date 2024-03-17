import React, { useState } from 'react';
import Modal from 'react-modal';

const ContactSelectionDialog = ({ contacts, isOpen, onClose }) => {
    const [selectedContact, setSelectedContact] = useState();

    const handleContactSelect = (contact) => {
        if (contact) {
            setSelectedContact(contact)
            if (selectedContact) {
                console.log("select", selectedContact);
            }
        }
    };

    const handleClose = () => {
        // Close the dialog and pass the selected contact if available
        onClose(selectedContact);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={handleClose}>
            <h2>Select Contact</h2>
            <div>
                {contacts.map((contact, index) => (
                    <div key={index} onClick={() => handleContactSelect(contact.phoneNumber)}>
                        {contact.name} - {contact.phoneNumber} {/* Adjust this based on your contact structure */}
                    </div>
                ))}
            </div>
            <button onClick={handleClose}>Close</button>
        </Modal>
    );
};
export default ContactSelectionDialog;



