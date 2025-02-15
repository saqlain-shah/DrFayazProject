import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "appointment@avicenahealthcare.com", // Your Gmail email address
    pass: "ouodydxliqapokdr", // Your Gmail password
  },
});
const sendAppointmentConfirmationEmail = async (selectValue) => {
  try {
    await transporter.sendMail({
      from: "your_email@gmail.com", // Replace with your email
      to: selectValue.email,
      subject: "Appointment Confirmation",
      html: `<p>Your appointment has been successfully scheduled.</p>`,
    });
    console.log("Appointment confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending appointment confirmation email:", error);
    throw new Error("Error sending appointment confirmation email");
  }
};

export default sendAppointmentConfirmationEmail
