// import React, { useEffect } from 'react';
// import { Button } from 'antd';
// import Dropzone from '../DropZone';
// import { useState } from 'react';
// // import Attachments from '../Attachment';
// const PersonalInformation = ({handleFileChange, handleChange, selectValue, selectedSlot }) => {
//     const { name, reasonForVisit, bloodGroup, attachments, gender, emergencyContact, email, address } = selectValue;
//     const [files, setFiles] = useState([])
//     useEffect(() => {
//         // if (selectedSlot) {
//         //     // Extract user data from the selected slot
//         //     const { patientName, reasonForVisit, patientGender, patientBloodGroup, patientEmail, patientContact } = selectedSlot;
//         //     console.log('Populating User Data:', { patientName, reasonForVisit }); // Log user data
//         //     // Set the user data in the state
//         //     // handleChange({ target: { name: 'name', value: patientName } });
//         //     handleChange({ target: { name: 'reasonForVisit', value: reasonForVisit } });
//         // }
//     }, [selectedSlot]);

//     const handleNext = () => {
//         // Call the onNext function passed from the parent component to move to the next step
//         // onNext();
//     };

//     const handlePrev = () => {
//         // Call the onPrev function passed from the parent component
//         // onPrev();
//     };
//     const handleFilesChange = (newFiles) => {
//         setFiles(newFiles)
//         handleFileChange(files)
//     }

//     return (
//         <form className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
//             <div className="row">
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Full Name</label>
//                         <input disabled name='name' value={name || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Email</label>
//                         <input disabled name='email' value={email || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Blood Group</label>
//                         <input disabled name='bloodGroup' value={bloodGroup || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Gender</label>
//                         <input disabled name='gender' value={gender || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Contact</label>
//                         <input disabled name='emergencyContact' value={emergencyContact || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Address</label>
//                         <input disabled name='emergencyContact' value={address || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-12 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Reason For Visit</label>
//                         <textarea rows={4} onChange={(e) => handleChange(e)} name='reasonForVisit' value={reasonForVisit || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-12 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Attachments</label>
//                         <Dropzone
//                             handleChange={handleFileChange}
//                             files={attachments}
//                         />
//                     </div>
//                 </div>
//             </div>
//             {/* <div className="text-end">
//                 <Button
//                     type="primary"
//                     size="large"
//                     style={{ marginRight: '8px' }}
//                     onClick={handleNext}
//                     disabled={!name || !emergencyContact || !email || !bloodGroup || !gender || !reasonForVisit}
//                 >
//                     Next
//                 </Button>
//                 <Button
//                     size="large"
//                     onClick={handlePrev}
//                 >
//                     Previous
//                 </Button>
//             </div> */}
//         </form>
//     );
// };

// export default PersonalInformation;


import React, { useEffect, useState } from 'react';
import Dropzone from '../DropZone'; // Adjust the path if necessary

const PersonalInformation = ({ handleFileChange, handleChange, selectValue }) => {
  const { name, reasonForVisit, bloodGroup, gender, emergencyContact, email, address } = selectValue;
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Retrieve base64 files from local storage and convert them to File objects
    const fetchFilesFromLocalStorage = async () => {
      const storedFiles = JSON.parse(localStorage.getItem('attachments') || '[]');
      const fileObjects = await Promise.all(storedFiles.map(async (base64) => {
        const response = await fetch(base64);
        const blob = await response.blob();
        return new File([blob], 'filename', { type: blob.type });
      }));
      setFiles(fileObjects);
      handleFileChange(fileObjects);
    };

    fetchFilesFromLocalStorage();
  }, []);

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
    handleFileChange(newFiles);
  };

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
