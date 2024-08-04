import React, { useState } from 'react';
import Dropzone from './DropZone'; // Adjust the path if necessary
import { Button, notification } from 'antd';
import DashboardLayout from './Doctor/DashboardLayout/DashboardLayout';

const Attachment = ({ onFileChange = () => {}, onDone = () => {} }) => {
  const [attachments, setAttachments] = useState([]);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (files) => {
    const fileArray = Array.from(files);
    const base64Files = await Promise.all(fileArray.map(file => fileToBase64(file)));
    setAttachments(base64Files);
    localStorage.setItem('attachments', JSON.stringify(base64Files)); // Save base64 files to local storage
    onFileChange(fileArray); // Call onFileChange if provided
  };

  const handleDone = () => {
    notification.success({
      message: 'Success',
      description: 'Attachments have been saved successfully!',
    });
    onDone(attachments);
  };

  return (
    <DashboardLayout>
      <div className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <div className="form-group card-label mb-3">
              <label>Attachments</label>
              <Dropzone
                handleChange={(files) => handleFileChange(files)}
                files={attachments.map(base64 => ({
                  name: base64.split(',')[1], // Use the base64 data as a placeholder for the filename
                  size: 0,
                  type: 'application/octet-stream',
                }))}
              />
              <Button onClick={handleDone} type="primary" style={{ marginTop: '10px' }}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attachment;
