import React from 'react';
import { Image } from 'antd';
import jsPDF from 'jspdf';
const PatientDetails = ({ medicalRecords, profileData, webPatientData }) => {

  const generatePDF = () => {
    const doc = new jsPDF();
    const content = document.getElementById('patientDetails');
    doc.html(content, {
      callback: function (doc) {
        doc.save('patient_details.pdf');
      }
    });
  };


  // Check if both profileData and webPatientData are empty
  if ((!profileData || Object.keys(profileData).length === 0) && (!webPatientData || Object.keys(webPatientData).length === 0)) {
    return <div className="text-center mt-8">No patient data available.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Render medical records */}
      <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
        {medicalRecords && medicalRecords.success && medicalRecords.data && medicalRecords.data.length > 0 ? (
          medicalRecords.data.map(record => (
            <div key={record._id}>
              <h3 className="text-lg font-semibold mb-2">Record ID: {record._id}</h3>
              <p>Complaints: {record.complaints.join(', ')}</p>
              <p>Diagnosis: {record.diagnosis}</p>
              <p>Treatment: {record.treatment.map(item => item.name).join(', ')}</p>
              {/* Render vital signs */}
              <p>Vital Signs: {record.vitalSigns.join(', ')}</p>
              {/* Render prescription details if available */}
              {record.prescription && record.prescription.medicines && record.prescription.medicines.length > 0 && (
                <div>
                  <h4>Prescription:</h4>
                  <ul>
                    {record.prescription.medicines.map(medicine => (
                      <li key={medicine._id}>
                        <p>Name: {medicine.name}</p>
                        <p>Dosage: {medicine.dosage}</p>
                        <p>Instructions: {medicine.instructions}</p>
                        <p>Amount: {medicine.amount}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {record.attachments && record.attachments.length > 0 && (
                <div>
                  <h4>Attachments:</h4>
                  <ul>
                    {record.attachments.map(attachment => (
                      <li key={attachment._id}>
                        <Image src={`https://server-yvzt.onrender.com /uploads/${attachment.filename}`} alt={attachment.filename} style={{ width: '200px', height: '200px' }} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No medical records found.</p>
        )}
      </div>

      {/* Render profile data if available */}
      {profileData && Object.keys(profileData).length > 0 && renderProfileData(profileData)}

      {/* Render web patient data if available */}
      {webPatientData && Object.keys(webPatientData).length > 0 && renderWebPatientData(webPatientData)}
    </div>
  );
};

const renderProfileData = (profileData) => (
  <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-md mb-6">
    <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <ul className="list-disc pl-4">
        <Image
                      src={`https://server-yvzt.onrender.com /${profileData.profilePicture}`}
                      alt={profileData.fullName}
                      className="w-full h-11 rounded-full object-cover border border-border"
                    />
          <li><span className="font-semibold">Full Name:</span> {profileData.fullName}</li>
          <li><span className="font-semibold">Gender:</span> {profileData.gender}</li>
          <li><span className="font-semibold">Blood Group:</span> {profileData.bloodGroup}</li>
          <li><span className="font-semibold">Address:</span> {profileData.address}</li>
          <li><span className="font-semibold">Email:</span> {profileData.email}</li>
          <li><span className="font-semibold">Emergency Contact:</span> {profileData.emergencyContact}</li>
        </ul>
      </div>
    </div>
  </div>
);

const renderWebPatientData = (webPatientData) => (
  <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-md mb-6">
    <h2 className="text-xl font-semibold mb-4"> Patient Details</h2>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <ul className="list-disc pl-4">
        <Image
                      src={`https://server-yvzt.onrender.com /${webPatientData.patientInfo.image}`}
                      alt={webPatientData.name}
                      className="w-full h-11 rounded-full object-cover border border-border"
                    />
          <li><span className="font-semibold">Full Name:</span> {webPatientData.patientInfo ? webPatientData.patientInfo.name : ''}</li>
          <li><span className="font-semibold">Gender:</span> {webPatientData.patientInfo ? webPatientData.patientInfo.gender : ''}</li>
          <li><span className="font-semibold">Blood Group:</span> {webPatientData.patientInfo ? webPatientData.patientInfo.bloodGroup : ''}</li>
          <li><span className="font-semibold">Address:</span> {webPatientData.patientInfo ? webPatientData.patientInfo.address : ''}</li>
          <li><span className="font-semibold">Email:</span> {webPatientData.patientInfo ? webPatientData.patientInfo.email : ''}</li>
          <li><span className="font-semibold">Emergency Contact:</span> {webPatientData.patientInfo ? webPatientData.patientInfo.emergencyContact : ''}</li>         
               
        </ul>
      </div>
      
    </div>
  </div>
);

export default PatientDetails;
