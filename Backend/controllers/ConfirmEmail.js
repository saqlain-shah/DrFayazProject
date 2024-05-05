// controllers/ConfirmEmail.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saqlainshahbaltee@gmail.com", // Replace with your email
    pass: "vehcdityutwcutzh", // Replace with your password
  },
});

const sendAppointmentConfirmationEmail = async (selectValue) => {
  try {
    const { name, email, appointmentDetails } = selectValue;

    // HTML content for the email with dynamic data
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
      from: "saqlainshahbaltee@gmail.com",
      to: email, // Send email to the provided email address
      subject: "Appointment Confirmation",
      html: htmlContent, // Use the dynamically generated HTML content
    });
    console.log("Appointment confirmation email sent to patient successfully");
  } catch (error) {
    console.error("Error sending appointment confirmation email to patient:", error);
    throw new Error("Error sending appointment confirmation email to patient");
  }
};

const sendDoctorAppointmentEmail = async (selectValue,handleConfirmAppointment) => {
    console.log("handleConfirmAppointment",handleConfirmAppointment)
    console.log("selectValue",selectValue)
  try {
    const { name, email,bloodGroup,emergencyContact,gender } = selectValue;

    // HTML content for the email with dynamic data
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
      from: "saqlainshahbaltee@gmail.com",
      to: email, // Send email to the doctor's email address
      subject: "New Appointment Scheduled",
      html: htmlContent, // Use the dynamically generated HTML content
    });
    console.log("Appointment notification email sent to doctor successfully");
  } catch (error) {
    console.error("Error sending appointment notification email to doctor:", error);
    throw new Error("Error sending appointment notification email to doctor");
  }
};

export { sendAppointmentConfirmationEmail, sendDoctorAppointmentEmail };
