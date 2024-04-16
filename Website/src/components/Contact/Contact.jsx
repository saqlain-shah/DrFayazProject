import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaLocationArrow, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import axios from 'axios';
import Header from "../Shared/Header/Header";
import SubHeader from "../Shared/SubHeader";

const Contact = () => {
  const { handleSubmit, register, formState: { errors } } = useForm(); // Update destructuring to include formState
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);




  const onSubmit = async (data) => {
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post("http://localhost:8800/api/userauth/send-email", {
        email: data.email,
        subject: "New Contact Form Submission",
        body: `
          First Name: ${data.firstName}
          Last Name: ${data.lastName}
          Email: ${data.email}
          Subject: ${data.subject}
          Message: ${data.message}
        `,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSendSuccess(true);
      } else {
        setSendError(response.data.error || "Error sending email");
      }
    } catch (error) {
      setSendError("Error sending email");
    } finally {
      setIsSending(false);
    }
  };


  return (
    <>
      <Header />
      <SubHeader
        title="Contact us"
        subtitle="In Any Emergency case, contact us."
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
                    <p>fayyaz_sarwar@hotmail.com</p>
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

                      />
                      {errors.firstName && (
                        <p className="text-danger">{errors.firstName.message}</p>
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

                      />
                      {errors.lastName && (
                        <p className="text-danger">{errors.lastName.message}</p>
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

                      />
                      {errors.email && (
                        <p className="text-danger">{errors.email.message}</p>
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

                      />
                      {errors.subject && (
                        <p className="text-danger">{errors.subject.message}</p>
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

                      />
                      {errors.message && (
                        <p className="text-danger">{errors.message.message}</p>
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
