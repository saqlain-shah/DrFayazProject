import React, { useState, useEffect } from 'react';
import Dropzone from './Drpozone2'; // Adjust the path if necessary
import { Button, notification, Card, Upload, Modal, List } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import DashboardLayout from './Doctor/DashboardLayout/DashboardLayout';

const { Meta } = Card;

const Attachment = ({ onFileChange = () => {}, onDone = () => {} }) => {
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    // Load attachments from local storage on component mount
    const savedAttachments = JSON.parse(localStorage.getItem('attachments')) || [];
    setAttachments(savedAttachments);
  }, []);

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
    const updatedAttachments = [...attachments, ...base64Files];
    setAttachments(updatedAttachments);
    localStorage.setItem('attachments', JSON.stringify(updatedAttachments));
    onFileChange(fileArray);
  };
  

  const handleDone = () => {
    notification.success({
      message: 'Success',
      description: 'Attachments have been saved successfully!',
    });
    onDone(attachments);
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

  const handleUpdate = (index, newFile) => {
    fileToBase64(newFile).then(base64 => {
      const updatedAttachments = attachments.map((item, i) => i === index ? base64 : item);
      setAttachments(updatedAttachments);
      localStorage.setItem('attachments', JSON.stringify(updatedAttachments));
    });
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
            <div style={{ marginTop: '20px' }}>
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={attachments}
                renderItem={(item, index) => (
                  <List.Item>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={`Attachment ${index}`}
                          src={item}
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