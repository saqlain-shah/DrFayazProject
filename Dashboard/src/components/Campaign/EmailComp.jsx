// EmailComp.js
import React, { useState } from 'react';
import { Button, Input, Textarea } from '../Form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmailComp({ data, closeModal, updateCampaignsState }) {
  const [campaignTitle, setCampaignTitle] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [header, setHeader] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
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
      const response = await axios.post('https://server-yvzt.onrender.com/api/email-campaigns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Campaign created:', response.data);
      toast.success('Campaign created successfully!');

      setCampaignTitle('');
      setEmailSubject('');
      setHeader('');
      setSubHeader('');
      setMessage('');
      setImage(null);

      closeModal();
      updateCampaignsState(response.data); // Update campaigns state with new campaign data
    } catch (error) {
      console.error('Error creating email campaign:', error);
      toast.error('Failed to create email campaign. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-6">
      <Input
        label="Campaign Title"
        color={true}
        placeholder={data?.id && data?.title}
        value={campaignTitle}
        onChange={(e) => setCampaignTitle(e.target.value)}
      />
      <Input
        label="Email subject"
        color={true}
        placeholder={data?.id && data?.action?.subject}
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
      />
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
      <Textarea
        label="Message"
        placeholder={data?.id ? data?.action?.message : 'Dear Delight patient ....'}
        color={true}
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <Button
        label={'Save Campaign'}
        onClick={handleSubmit}
      />
    </div>
  );
}

export default EmailComp;
