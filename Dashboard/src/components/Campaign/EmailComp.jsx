import React, { useState } from 'react';
import { Button, Input, Textarea } from '../Form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../baseUrl.jsx';

function EmailComp({ data, closeModal, updateCampaignsState }) {
  const [campaignTitle, setCampaignTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', campaignTitle);
      formData.append('description', description);
      formData.append('message', message);
      if (image) {
        formData.append('image', image);
      }
      formData.append('link', link);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/email-campaigns`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Campaign created:', response.data);
      toast.success('Campaign created successfully!');

      setCampaignTitle('');
      setDescription('');
      setMessage('');
      setImage(null);
      setLink('');

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
      <Textarea
        label="Description"
        placeholder={data?.id ? data?.action?.description : 'Enter campaign description...'}
        color={true}
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Textarea
        label="Message"
        placeholder={data?.id ? data?.action?.message : 'Dear Delight patient ....'}
        color={true}
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Input
        label="Link"
        color={true}
        placeholder="Enter link..."
        value={link}
        onChange={(e) => setLink(e.target.value)}
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