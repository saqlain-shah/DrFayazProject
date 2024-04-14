import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FaLocationArrow, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Header from "../Shared/Header/Header";
import SubHeader from "../Shared/SubHeader";

const Contact = () => {
  const { handleSubmit, errors } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const subjectRef = useRef();
  const messageRef = useRef();

  const sendEmail = async (emailData) => {
    setIsSending(true);
    try {
      // Replace this with your logic to send emails
      console.log("Email data:", emailData);
      // Simulating a successful email send
      setSendSuccess(true);
    } catch (error) {
      setSendError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = async (data) => {
    // Check if the expected properties exist in the data object
    if (
      data &&
      data.firstName &&
      data.lastName &&
      data.email &&
      data.subject &&
      data.message
    ) {
      const { firstName, lastName, email, subject, message } = data;
      const emailData = `
                From: "${firstName} ${lastName}" <${email}>
                To: "Fayaz Sarwar" <fayazsarwar@gmail.com>
                Subject: ${subject}
                
                ${message}
            `;

      await sendEmail(emailData);
    } else {
      console.error("Invalid form data:", data);
    }
  };

  return (
    <>
      <Header />
      <SubHeader
        title="Contact us"
        subtitle="In Any Emergencey case contact us."
      />
      <section id="contact" className="contact mt-5 mb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div
                className="info rounded p-3"
                style={{ background: "#f8f9fa" }}
              >
                <div className="d-flex mb-2 gap-2">
                  <FaLocationArrow className="icon" />
                  <div>
                    <h4>Location:</h4>
                    <p>1212 UK 03214</p>
                  </div>
                </div>

                <div className="d-flex mb-2 gap-2">
                  <FaEnvelope className="icon" />
                  <div>
                    <h4>Email:</h4>
                    <p>fayazsarwar@gmail.com</p>
                  </div>
                </div>

                <div className="d-flex mb-2 gap-2">
                  <FaPhoneAlt className="icon" />
                  <div>
                    <h4>Call:</h4>
                    <p>+44 7579 389649</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div
                className="mb-5 p-2 rounded"
                style={{ background: "#f8f9fa" }}
              >
                <form
                  className="row form-row"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="form-control mb-3"
                        ref={firstNameRef}
                      />
                      {errors && errors.firstName && (
                        <p className="text-danger">First name is required</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="form-control mb-3"
                        ref={lastNameRef}
                      />
                      {errors && errors.lastName && (
                        <p className="text-danger">Last name is required</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mb-2 card-label">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control mb-3"
                        ref={emailRef}
                      />
                      {errors && errors.email && (
                        <p className="text-danger">Email is required</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mb-2 card-label">
                      <label>Subject</label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="Enter your subject"
                        className="form-control mb-3"
                        ref={subjectRef}
                      />
                      {errors && errors.subject && (
                        <p className="text-danger">Subject is required</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        name="message"
                        cols="30"
                        rows="10"
                        placeholder="Enter your message"
                        className="form-control mb-3"
                        ref={messageRef}
                      />
                      {errors && errors.message && (
                        <p className="text-danger">Message is required</p>
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-3 mb-5">
                    <button
                      type="submit"
                      className="appointment-btn"
                      disabled={isSending}
                    >
                      {isSending ? "Sending..." : "Send Message"}
                    </button>
                    {sendError && <p className="text-danger">{sendError}</p>}
                    {sendSuccess && (
                      <p className="text-success">Email sent successfully!</p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
