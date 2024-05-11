import React from "react";
import { Image, Table, Button } from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "./Detail.css";
import html2canvas from "html2canvas";
import ImageGallery from "react-image-gallery";
import axios from "axios";

const PatientDetails = ({
  medicalRecords,
  profileData,
  webPatientData,
  InvoiceData,
  healthInfoData,
}) => {
  console.log("healthInfoData ", healthInfoData);
  console.log("medicalRecords ", medicalRecords);
  const generatePDF = async () => {
    const doc = new jsPDF();
    const content = document.getElementById("patientDetails");
    const attachmentGallery = document.querySelector(".attachment-gallery"); // Add this line

    // Check if content exists
    if (!content) {
      console.error("Content element not found");
      return;
    }

    // Hide export button before generating PDF
    const exportButton = document.querySelector(".export-button");
    if (exportButton) {
      exportButton.style.display = "none";
    }

    const attachmentImages = document.querySelectorAll(
      ".attachment-gallery img"
    );
    console.log("images", attachmentImages);
    for (let i = 0; i < attachmentImages.length; i++) {
      const imageUrl = attachmentImages[i].src;
      console.log("imageUrl", imageUrl);
      try {
        // const token = localStorage.getItem("token");
        // const response = await axios.get(imageUrl, {
        //   withCredentials: true,
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        //   crossOrigin: "anonymous"
        // });
        // console.log("res", response);
        // const blob = await response.blob();
        // doc.addImage(await blobToBase64(imageUrl), "PNG", 10, 10, 100, 100);
        // doc.imageLoadFromUrl(imageUrl);
        // // place this mage at given X, Y coordinates on the page
        // doc.imagePlace(20, 40);
        // doc.image(imageUrl, {
        //   x: 20,
        //   y: 40,
        //   width: 100, // Adjust width as needed
        //   height: 100 // Adjust height as needed
        // });

        function getDataUri(url, callback) {
          var image = new Image();
          image.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

            canvas.getContext("2d").drawImage(this, 0, 0);

            // Get raw image data
            callback(canvas.toDataURL("image/png"));
          };

          image.src = url;
        }

        // Usage:
        getDataUri(imageUrl, function (dataUri) {
          // Add image to PDF
          doc.addImage(dataUri, "JPEG", 20, 40, 50, 50); // Adjust width and height as needed
        });
        if (i !== attachmentImages.length - 1) {
          doc.addPage();
        }
      } catch (error) {
        console.error("Error adding image:", error);
      }
    }

    // Convert HTML content to canvas
    html2canvas(content)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 400; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add image to PDF
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

        // Handle multiple pages
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Add attachment gallery to PDF
        if (attachmentGallery) {
          attachmentGallery.childNodes.forEach((child) => {
            doc.addImage(child.src, "JPEG", 10, position + 10, 100, 100);
            position += 110; // Adjust position for the next image
            if (position >= pageHeight) {
              doc.addPage();
              position = 0;
            }
          });
        }

        // Save PDF
        doc.save("patient_details.pdf");

        // Restore export button after generating PDF
        if (exportButton) {
          exportButton.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        // Restore export button if an error occurs
        if (exportButton) {
          exportButton.style.display = "block";
        }
      });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  if (
    (!profileData || Object.keys(profileData).length === 0) &&
    (!webPatientData || Object.keys(webPatientData).length === 0)
  ) {
    return <div className="text-center mt-8">No patient data available.</div>;
  }
 

  return (
    <div id="patientDetails" className="patient-details-container">
      <div className="patient-details-header">
        <h1 className="patient-details-title">Patient Details Sheet</h1>
        <Button className="export-button" onClick={generatePDF} type="primary">
          Export as PDF
        </Button>
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
                      src={`http://localhost:8800/uploads/${attachment.filename}`}
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
