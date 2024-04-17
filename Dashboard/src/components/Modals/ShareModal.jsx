import React, { useState } from 'react';
import axios from 'axios'; 
import Modal from './Modal';
import { Button } from '../Form';
import { toast } from 'react-hot-toast';
import { HiOutlineMail } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

export const shareData = [
  {
    id: 1,
    icon: HiOutlineMail,
    title: "Email",
    description: "Send to patient email address",
  },
  {
    id: 2,
    icon: FaWhatsapp,
    title: "WhatsApp",
    description: "Send to patient WhatsApp account",
  },
];

function ShareModal({ closeModal, isOpen, dataToShare }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!selectedOption) {
      toast.error('Please select a sharing option');
      return;
    }
  
    setLoading(true);
  
    try {
      // Make API request to share data
      const response = await axios.post('https://server-yvzt.onrender.com/api/files/share/whatsapp', {
        method: selectedOption === 1 ? 'email' : 'whatsapp', // Determine sharing method
        data: dataToShare, // Data to be shared (file path or other relevant data)
      });
  
      toast.success(response.data.message); // Display success message from server
      closeModal();
      setLoading(false);
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share');
      setLoading(false);
    }
  };

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title="Share Data"
      width={'max-w-xl'}
    >
      <div className="flex-col gap-6">
        {/* Render sharing options */}
        <div className="w-full">
          {shareData.map(option => (
            <div key={option.id} className="flex items-center gap-4">
              <input
                type="radio"
                id={option.id}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
              />
              <label htmlFor={option.id}>
                <option.icon className="text-xl" /> {option.title}
              </label>
            </div>
          ))}
        </div>

        {/* Share button */}
        <Button
          onClick={handleShare}
          label={loading ? 'Sharing...' : 'Share'}
          disabled={loading}
        />
      </div>
    </Modal>
  );
}

export default ShareModal;
