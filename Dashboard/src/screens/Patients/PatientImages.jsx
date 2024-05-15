import React, { useEffect } from 'react';
import axios from 'axios';
import { Image, Button } from 'antd';

function PatientImages({ medicalRecords, webPatientAttachments, token }) {
  useEffect(() => {
    if (!medicalRecords) return;
  }, [medicalRecords]);

  return (
    <div className="flex flex-wrap justify-center">
      {/* Render attachments from medical records */}
      {medicalRecords && medicalRecords.data && medicalRecords.data.map((record, index) => (
        <div key={index} className="m-4">
          <div className="flex flex-wrap justify-center gap-4">
            {record.attachments && record.attachments.map((attachment, attachmentIndex) => {
              const imageUrl = `http://localhost:8800/uploads/${attachment.filename}`;
              return (
                <div key={attachmentIndex} className="flex flex-col items-center">
                  {attachment.filename && (
                    <div className="mb-2">
                      <Image
                        src={imageUrl}
                        alt={attachment.originalname}
                        className="rounded-lg shadow-md"
                        style={{ width: "200px", height: "200px", maxWidth: "100%" }}
                        onError={(e) => {
                          console.error('Error loading image:', e.target.src);
                        }}
                      />
                    </div>
                  )}
                  <Button
                    type="primary"
                    href={imageUrl}
                    download={attachment.originalname}
                    style={{ marginTop: "5px" }}
                  >
                    Download
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Render attachments from web patient */}
      {webPatientAttachments && webPatientAttachments.map((attachment, index) => {
        const imageUrl = `http://localhost:8800/${attachment}`;
        return (
          <div key={index} className="flex flex-col items-center">
            <div className="mb-2">
              <Image
                src={imageUrl}
                alt={`Attachment ${index}`}
                className="rounded-lg shadow-md"
                style={{ width: "200px", height: "200px", maxWidth: "100%" }}
                onError={(e) => {
                  console.error('Error loading image:', e.target.src);
                }}
              />
            </div>
            <Button
              type="primary"
              href={imageUrl}
              download={`Attachment${index}`}
              style={{ marginTop: "5px" }}
            >
              Download
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default PatientImages;
