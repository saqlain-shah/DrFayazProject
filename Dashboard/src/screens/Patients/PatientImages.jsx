import React, { useEffect } from 'react';
import axios from 'axios';

function PatientImages({ medicalRecords }) {
  useEffect(() => {
    const fetchImages = async () => {
      try {
        medicalRecords && medicalRecords.data && medicalRecords.data.forEach(record => {
          record.attachments && record.attachments.forEach(attachment => {
            const imageUrl = `http://localhost:8800/${attachment.filename}`;
            axios.get(imageUrl)
              .then(response => {
                console.log('Image loaded successfully:', response);
              })
              .catch(error => {
                console.error('Error fetching image:', error);
              });
          });
        });
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [medicalRecords]);

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {medicalRecords && medicalRecords.data && medicalRecords.data.map((record, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-md max-w-xs">
          <h3 className="text-lg font-semibold mb-2">{record.fullName}</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {record.attachments && record.attachments.map((attachment, attachmentIndex) => {
              const imageUrl = `http://localhost:8800/uploads/${attachment.filename}`;
              return (
                <div key={attachmentIndex}>
                  {attachment.filename && (
                    <img
                      src={imageUrl}
                      alt={attachment.originalname}
                      className="rounded-lg shadow-md"
                      onLoad={() => {
                        axios.get(imageUrl, {
                          headers: { Authorization: `Bearer ${token}` }
                        }).then(response => {
                          console.log('Image loaded successfully:', response);
                        }).catch(error => {
                          console.error('Error fetching attachment image:', error);
                        });
                      }}
                    />
                  )}
                  {/* Log the constructed image URL */}
                  {console.log(`Image URL ${attachmentIndex}: ${imageUrl}`)}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PatientImages;
