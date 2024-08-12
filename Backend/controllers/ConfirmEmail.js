// controllers/ConfirmEmail.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'davbabu1122@gmail.com',
    pass: 'Godaay2024'
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

const sendAppointmentConfirmationEmail = async (selectValue) => {
  try {
    const { name, email, appointmentDetails } = selectValue;

    const htmlContent = `
      <p>Hi ${name},</p>
      <p>Your appointment has been successfully scheduled.</p>
      <p>Here are the appointment details:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Appointment Details:</strong> ${appointmentDetails}</li>
      </ul>
    `;

    await transporter.sendMail({
      from: "davbabu1122@gmail.com",
      to: email,
      subject: "Appointment Confirmation",
      html: htmlContent,
    });
    console.log("Appointment confirmation email sent to patient successfully");
  } catch (error) {
    console.error("Error sending appointment confirmation email to patient:", error);
    throw new Error("Error sending appointment confirmation email to patient");
  }
};

const sendDoctorAppointmentEmail = async (selectValue) => {
  try {
    const { name, email, bloodGroup, emergencyContact, gender } = selectValue;

    const htmlContent = `
      <p>Hi Doctor,</p>
      <p>A new appointment has been scheduled.</p>
      <p>Here are the appointment details:</p>
      <ul>
        <li><strong>Patient Name:</strong> ${name}</li>
        <li><strong>Patient Email:</strong> ${email}</li>
        <li><strong>Patient bloodGroup:</strong> ${bloodGroup}</li>
        <li><strong>Patient emergencyContact:</strong> ${emergencyContact}</li>
        <li><strong>Patient gender:</strong> ${gender}</li>
      </ul>
    `;

    await transporter.sendMail({
      from: "davbabu1122@gmail.com",
      to: "davbabu1122@gmail.com",
      subject: "New Appointment Scheduled",
      html: htmlContent,
    });
    console.log("Appointment notification email sent to doctor successfully");
  } catch (error) {
    console.error("Error sending appointment notification email to doctor:", error);
    throw new Error("Error sending appointment notification email to doctor");
  }
};

export { sendAppointmentConfirmationEmail, sendDoctorAppointmentEmail };
