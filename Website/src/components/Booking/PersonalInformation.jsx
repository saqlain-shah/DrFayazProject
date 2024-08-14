import React, { useEffect, useState } from 'react';

const PersonalInformation = ({ handleFileChange, handleChange, selectValue }) => {
  const { name, reasonForVisit, bloodGroup, gender, emergencyContact, email, address } = selectValue;
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Retrieve base64 files from local storage and convert them to File objects
    const fetchFilesFromLocalStorage = () => {
      const savedAttachments = JSON.parse(localStorage.getItem('attachments')) || [];
      console.log('Files retrieved from local storage:', savedAttachments);
    
      if (Array.isArray(savedAttachments) && savedAttachments.length > 0) {
        try {
          const filesFromBase64 = savedAttachments.map(attachment => {
            if (attachment.base64 && typeof attachment.base64 === 'string' && attachment.base64.includes(',')) {
              const [header, data] = attachment.base64.split(',');
              const mimeMatch = header.match(/:(.*?);/);
    
              if (!mimeMatch) {
                throw new Error('Invalid MIME type');
              }
    
              const mime = mimeMatch[1];
              const blob = new Blob([new Uint8Array(atob(data).split('').map(char => char.charCodeAt(0)))], { type: mime });
              return new File([blob], attachment.name || 'filename', { type: mime });
            } else {
              throw new Error('Invalid base64 format');
            }
          });
          setFiles(filesFromBase64);
        } catch (error) {
          console.error('Error converting base64 to files:', error);
        }
      } else {
        console.log('No files found in local storage.');
      }
    };
    
  
    fetchFilesFromLocalStorage();
  }, []);
  

    

  const renderFilePreviews = () => {
    return files.map((file, index) => (
      <div key={index} className="file-preview">
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
      </div>
    ));
  };

  return (
    <form className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="form-group card-label mb-3">
            <label>Full Name</label>
            <input disabled name='name' value={name || ''} className="form-control" type="text" />
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="form-group card-label mb-3">
            <label>Email</label>
            <input disabled name='email' value={email || ''} className="form-control" type="text" />
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="form-group card-label mb-3">
            <label>Blood Group</label>
            <input disabled name='bloodGroup' value={bloodGroup || ''} className="form-control" type="text" />
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="form-group card-label mb-3">
            <label>Gender</label>
            <input disabled name='gender' value={gender || ''} className="form-control" type="text" />
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="form-group card-label mb-3">
            <label>Contact</label>
            <input disabled name='emergencyContact' value={emergencyContact || ''} className="form-control" type="text" />
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="form-group card-label mb-3">
            <label>Address</label>
            <input disabled name='address' value={address || ''} className="form-control" type="text" />
          </div>
        </div>
        <div className="col-md-12 col-sm-12">
          <div className="form-group card-label mb-3">
            <label>Reason For Visit</label>
            <textarea rows={4} onChange={(e) => handleChange(e)} name='reasonForVisit' value={reasonForVisit || ''} className="form-control" />
          </div>
        </div>
        <div className="col-md-12 col-sm-12">
          <div className="form-group card-label mb-3">
            <label>Attachments</label>
            <div className="attachments-preview mt-3">
              {renderFilePreviews()}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PersonalInformation;
