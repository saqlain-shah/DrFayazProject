import React, { useState, useEffect } from 'react';
import Dropzone from './Drpozone2'; // Adjust the path if necessary
import { Button, notification, Card, Upload, Modal, List } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import DashboardLayout from './Doctor/DashboardLayout/DashboardLayout';

const { Meta } = Card;

const Attachment = ({ onFileChange = () => {}, onDone = () => {} }) => {
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const savedAttachments = JSON.parse(localStorage.getItem('attachments')) || [];
    console.log('Files retrieved from local storage:', savedAttachments);
    if (savedAttachments.length > 0) {
      setAttachments(savedAttachments);
    } else {
      console.log('No files found in local storage.');
    }
  }, []);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ name: file.name, base64: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (files) => {
    const fileArray = Array.from(files);
    const base64Files = await Promise.all(fileArray.map(fileToBase64));
    const updatedAttachments = [...attachments, ...base64Files];
    setAttachments(updatedAttachments);
    localStorage.setItem('attachments', JSON.stringify(updatedAttachments));
    onFileChange(fileArray);
  };

  const handleUpdate = (index, newFile) => {
    fileToBase64(newFile).then(({ base64 }) => {
      const updatedAttachments = attachments.map((item, i) => i === index ? { ...item, base64 } : item);
      setAttachments(updatedAttachments);
      localStorage.setItem('attachments', JSON.stringify(updatedAttachments));
    });
  };

  const handleDelete = (index) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this attachment?',
      onOk: () => {
        const updatedAttachments = attachments.filter((_, i) => i !== index);
        setAttachments(updatedAttachments);
        localStorage.setItem('attachments', JSON.stringify(updatedAttachments));
      }
    });
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
      <div className="rounded p-3 mt-1" style={{ background: "#f8f9fa" }}>
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <div className="form-group card-label mb-3">
              <label>Attachments</label>
              <Dropzone
                handleChange={(files) => handleFileChange(files)}
                files={attachments.map(({ name, base64 }) => ({
                  name, // Use the original name of the file
                  size: 0,
                  type: 'application/octet-stream',
                }))}
              />
              <Button onClick={handleDone} type="primary" style={{ marginTop: '10px' }}>
                Done
              </Button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={attachments}
                renderItem={({ base64 }, index) => (
                  <List.Item>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={`Attachment ${index}`}
                          src={base64} // Use the base64 data as the image source
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                      }
                      actions={[
                        <Upload
                          showUploadList={false}
                          customRequest={({ file }) => handleUpdate(index, file)}
                        >
                          <Button icon={<UploadOutlined />} />
                        </Upload>,
                        <Button icon={<DeleteOutlined />} onClick={() => handleDelete(index)} />
                      ]}
                    >
                      <Meta title={`Attachment ${index + 1}`} />
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attachment;
