import React, { useRef } from "react";
import { Image, Table } from "antd";
import dayjs from "dayjs";
import "./Detail.css";
import html2canvas from "html2canvas";
import { Button } from "antd";
import jsPDF from "jspdf";
import BASE_URL from "../../baseUrl.jsx";

const PatientDetails = ({
  medicalRecords,
  profileData,
  webPatientData,
  InvoiceData,
  healthInfoData,
}) => {
  console.log("healthInfoData ", healthInfoData);
  console.log("medicalRecords ", medicalRecords);

  const pdfRef = useRef();

  const handleGeneratePDF = () => {
    console.log("medicalRecords in handleGeneratePDF:", medicalRecords);
  
    const input = document.getElementById("patientDetails");
  
    const options = {
      scale: 3,
      useCORS: true,
    };
  
    html2canvas(input, options).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Maintain aspect ratio
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfHeightAdjusted = pdfWidth / canvasAspectRatio;
  
      // Margins
      const marginX = 10;
      const marginY = 10;
  
      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", marginX, marginY, pdfWidth - 2 * marginX, pdfHeightAdjusted - marginY);
  
      let addedAttachments = false; // Track if any attachments were added
  
      if (Array.isArray(medicalRecords.data)) {
        medicalRecords.data.forEach((record, recordIndex) => {
          if (record.attachments && record.attachments.length > 0) {
            let x = marginX;
            let y = 30;
            const maxWidth = 90;
            const maxHeight = 70;
            const gap = 10;
  
            let imagesAdded = 0; // Track number of images added
  
            record.attachments.forEach((attachment, attIndex) => {
              const fileUrl = `${BASE_URL}/uploads/${attachment.filename}`;
              const isImage = /\.(jpg|jpeg|png|gif)$/i.test(attachment.filename);
              if (!isImage) return;
  
              const img = document.createElement("img");
              img.crossOrigin = "anonymous";
  
              img.onload = function () {
                const aspectRatio = img.width / img.height;
                let imgWidth = maxWidth;
                let imgHeight = imgWidth / aspectRatio;
  
                if (imgHeight > maxHeight) {
                  imgHeight = maxHeight;
                  imgWidth = imgHeight * aspectRatio;
                }
  
                // If it's the first attachment, add a new page and label it
                if (!addedAttachments) {
                  pdf.addPage();
                  pdf.setFontSize(14);
                  pdf.text(`Attachments for Record ${recordIndex + 1}`, marginX, 20);
                  addedAttachments = true;
                }
  
                pdf.setFontSize(10);
                pdf.text(`Attachment ${attIndex + 1}`, x, y - 5);
                pdf.addImage(img, "PNG", x, y, imgWidth, imgHeight);
                imagesAdded++;
  
                if (x + maxWidth + gap > pdfWidth - marginX) {
                  x = marginX;
                  y += maxHeight + gap;
                } else {
                  x += maxWidth + gap;
                }
  
                if (y + maxHeight > pdfHeight - marginY) {
                  pdf.addPage();
                  pdf.setFontSize(14);
                  pdf.text(`Attachments (contd.) for Record ${recordIndex + 1}`, marginX, 20);
                  x = marginX;
                  y = 30;
                }
              };
  
              img.onerror = function () {
                console.error("Failed to load image:", fileUrl);
              };
  
              img.src = fileUrl;
            });
  
            // If no images were added, remove the extra page
            if (imagesAdded === 0 && addedAttachments) {
              pdf.deletePage(pdf.internal.pages.length - 1);
            }
          }
        });
  
        pdf.save("patient_details.pdf");
      } else {
        console.error("medicalRecords.data is not an array.");
      }
    });
  };
  
  
  
  
  
  

  return (
    <div id="patientDetails" className="patient-details-container">
      <div className="patient-details-header">
        <h1 className="patient-details-title">Patient Details Sheet</h1>
        <div className="patient-details-section">
          <Button className="export-button" onClick={handleGeneratePDF}>
            Generate PDF
          </Button>
        </div>
      </div>

      <div className="flex-container">
        <div className="patient-details-section">
          <h2 className="section-title">Medical Records</h2>
          {medicalRecords &&
          medicalRecords.success &&
          medicalRecords.data &&
          medicalRecords.data.length > 0 ? (
            <Table
              dataSource={medicalRecords.data}
              columns={medicalRecordColumns}
              pagination={false}
            />
          ) : (
            <p>No medical records found.</p>
          )}
        </div>
        <br />
        <div className="patient-details-section">
          <h2 className="section-title" style={{ marginBottom: "5px" }}>
            Patient Information
          </h2>
          {profileData && Object.keys(profileData).length > 0 && (
            <ProfileDataTable profileData={profileData} />
          )}
        </div>

        <div className="patient-details-section">
          {webPatientData && Object.keys(webPatientData).length > 0 && (
            <WebPatientDataTable webPatientData={webPatientData} />
          )}
        </div>

        <div className="patient-details-section">
          <h2 className="section-title">Health Information</h2>
          {healthInfoData && healthInfoData.length > 0 ? (
            <Table
              dataSource={healthInfoData}
              columns={healthInfoColumns}
              pagination={false}
            />
          ) : (
            <p>No health information found.</p>
          )}
        </div>

        <div className="patient-details-section invoice">
          <h2 className="section-title">Invoices</h2>
          {InvoiceData && InvoiceData.length > 0 ? (
            <Table
              dataSource={InvoiceData}
              columns={invoiceColumns}
              pagination={false}
            />
          ) : (
            <p>No invoices found.</p>
          )}
        </div>
        {/* Rendering attachments outside the table */}
        <div className="attachment-section">
          <h2 className="section-title">Attachments</h2>
          <div className="attachment-gallery">
            {medicalRecords &&
              medicalRecords.data &&
              medicalRecords.data.map(
                (record) =>
                  record.attachments &&
                  record.attachments.length > 0 &&
                  record.attachments.map((attachment, index) => (
                    <Image
                      key={index}
                      src={`${BASE_URL}/uploads/${attachment.filename}`}
                      alt={attachment.originalname}
                      width={250}
                      height={250}
                      style={{ margin: 5, padding: 10 }}
                    />
                  ))
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileDataTable = ({ profileData }) => {
  return (
    <div className="custom-table-container">
      <Table
        className="custom-table"
        dataSource={[profileData]}
        columns={renderProfileDataColumns}
        pagination={false}
        bordered
      />
    </div>
  );
};

const WebPatientDataTable = ({ webPatientData }) => {
  return (
    <div className="custom-table-container">
      <Table
        className="custom-table"
        dataSource={[webPatientData.patientInfo]}
        columns={renderWebPatientDataColumns}
        pagination={false}
        bordered
      />
    </div>
  );
};

// Define columns for medical records table
const medicalRecordColumns = [
  {
    title: "Complaints",
    dataIndex: "complaints",
    key: "complaints",
    render: (complaints) => complaints.join(", "),
  },
  {
    title: "Diagnosis",
    dataIndex: "diagnosis",
    key: "diagnosis",
  },
  {
    title: "Treatment",
    dataIndex: "treatment",
    key: "treatment",
    render: (treatment) => treatment.map((item) => item.name).join(", "),
  },
  {
    title: "Vital Signs",
    dataIndex: "vitalSigns",
    key: "vitalSigns",
    render: (vitalSigns) => (
      <ul>
        {vitalSigns.map((sign, index) => (
          <li key={index}>
            <p>{sign}</p>
            {/* Add styling here as needed */}
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "Prescription",
    dataIndex: "prescription",
    key: "prescription",
    render: (prescription) =>
      prescription &&
      prescription.medicines &&
      prescription.medicines.length > 0 ? (
        <ul>
          {prescription.medicines.map((medicine) => (
            <li
              key={medicine._id}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <p>Name: {medicine.name}</p>
              <p>Dosage: {medicine.dosage}</p>
              <p>Instructions: {medicine.instructions}</p>
              <p>Amount: {medicine.amount}</p>
            </li>
          ))}
        </ul>
      ) : null,
  },
];

// Define columns for rendering profile data
const renderProfileDataColumns = [
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Blood Group",
    dataIndex: "bloodGroup",
    key: "bloodGroup",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Emergency Contact",
    dataIndex: "emergencyContact",
    key: "emergencyContact",
  },
];

// Define columns for rendering web patient data
const renderWebPatientDataColumns = [
  {
    title: "Full Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Blood Group",
    dataIndex: "bloodGroup",
    key: "bloodGroup",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Emergency Contact",
    dataIndex: "emergencyContact",
    key: "emergencyContact",
  },
];

// Define columns for rendering invoice data
const invoiceColumns = [
  {
    title: "Created Date",
    dataIndex: "createdDate",
    key: "createdDate",
    render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text, record) => <span>${record.total}</span>,
  },
  {
    title: "Patient Name",
    dataIndex: ["patient", "fullName"],
    key: "patientName",
  },
  {
    title: "Patient Email",
    dataIndex: ["patient", "email"],
    key: "patientEmail",
  },
  {
    title: "Invoice Items",
    dataIndex: "invoiceItems",
    key: "invoiceItems",
    render: (invoiceItems) => (
      <ul>
        {invoiceItems.map((item, index) => (
          <li key={index}>
            {`${item.name} - $${item.price} x ${item.quantity}`}
          </li>
        ))}
      </ul>
    ),
  },
  // Add other columns as needed
];

const healthInfoColumns = [
  {
    title: "Blood Type",
    dataIndex: "bloodType",
    key: "bloodType",
  },
  {
    title: "Height",
    dataIndex: "height",
    key: "height",
  },
  {
    title: "Weight",
    dataIndex: "weight",
    key: "weight",
  },
  {
    title: "Allergies",
    dataIndex: "allergies",
    key: "allergies",
  },
  {
    title: "Habits",
    dataIndex: "habits",
    key: "habits",
  },
  {
    title: "Medical History",
    dataIndex: "medicalHistory",
    key: "medicalHistory",
  },
];

export default PatientDetails;
