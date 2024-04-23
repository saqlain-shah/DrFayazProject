import React, { useState } from 'react';
import { Button, Input, Select, Textarea } from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const sendToData = [
  {
    id: 1,
    name: 'All Patients',
    value: 'all',
  },
  {
    id: 2,
    name: 'NHCF Patients',
    value: 'nhcf',
  },
  {
    id: 3,
    name: 'Britam Patients',
    value: 'britam',
  },
];

function EmailComp({ data, closeModal }) {
  const [campaignTitle, setCampaignTitle] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [header, setHeader] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null); // Add image state
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async () => {
    try {
      // Submit the campaign
      const formData = new FormData();
      formData.append('title', campaignTitle);
      formData.append('subject', emailSubject);
      formData.append('header', header);
      formData.append('subHeader', subHeader);
      formData.append('message', message);
      if (image) {
        formData.append('image', image);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8800/api/email-campaigns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Campaign created:', response.data);
      toast.success('Campaign created successfully!');

      // Reset form fields
      setCampaignTitle('');
      setEmailSubject('');
      setHeader('');
      setSubHeader('');
      setMessage('');
      setImage(null);

      // Close modal
      closeModal();
    } catch (error) {
      console.error('Error creating email campaign:', error);
      toast.error('Failed to create email campaign. Please try again later.');
    }
  };



  return (
    <div className="flex flex-col gap-4 w-full mt-6">
      {/* title */}
      <Input
        label="Campaign Title"
        color={true}
        placeholder={data?.id && data?.title}
        value={campaignTitle}
        onChange={(e) => setCampaignTitle(e.target.value)}
      />
      {/* send to */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* subject */}
        <Input
          label="Email subject"
          color={true}
          placeholder={data?.id && data?.action?.subject}
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
        />
      </div>
      {/* headers */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Header"
          color={true}
          placeholder={data?.id && data?.action?.header}
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />
        <Input
          label="Sub-header"
          color={true}
          placeholder={data?.id && data?.action?.subHeader}
          value={subHeader}
          onChange={(e) => setSubHeader(e.target.value)}
        />
      </div>
      {/* message */}
      <Textarea
        label="Message"
        placeholder={
          data?.id ? data?.action?.message : 'Dear Delight patient ....'
        }
        color={true}
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Image input */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      {/* button */}
      {!data?.id && (
        <Button
          label={'Save Campaign'}
          onClick={handleSubmit}
        />
      )}
    </div>
  );
}

export default EmailComp;
