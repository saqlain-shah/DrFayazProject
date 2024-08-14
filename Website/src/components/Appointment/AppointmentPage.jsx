import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { LoadingOutlined } from '@ant-design/icons';
// import moment from "moment";
import axios from "axios";
import { Button, Steps, message, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../Shared/Header/Header";
import SelectAppointment from "./SelectApppointment";
import PersonalInformation from "../Booking/PersonalInformation";
import { useCreateAppointmentByUnauthenticateUserMutation } from "../../redux/api/appointmentApi";
import { useDispatch } from "react-redux";
import { addInvoice } from "../../redux/feature/invoiceSlice";
import { loadStripe } from "@stripe/stripe-js";

const initialValue = {
  name: "",
  email: "",
  attachments: [],
  emergencyContact: 0,
  reasonForVisit: "",
  description: "",
  address: "",
};

const AppointmentPage = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [current, setCurrent] = useState(0);
  const params = useParams();
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [isCheck, setIsChecked] = useState(false);
  const [selectValue, setSelectValue] = useState(initialValue);
  const [isDisable, setIsDisable] = useState(true);
  const [isConfirmDisable, setIsConfirmDisable] = useState(true);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [selectedService, setSelectedService] = useState({
    serviceName: "",
    price: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appointmentSelected, setAppointmentSelected] = useState(false); 
  const navigation = useNavigate();

  const [
    createAppointmentByUnauthenticateUser,
    { data: appointmentData, isError, isSuccess, isLoading, error },
  ] = useCreateAppointmentByUnauthenticateUserMutation();

  const handleChange = (e) => {
    setSelectValue({ ...selectValue, [e.target.name]: e.target.value });
  };

  const handleFileChange = (files) => {
    setSelectValue({ ...selectValue, attachments: files });
  };

  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  const handleSelectAppointment = (slots, patientId, profileSettingId) => {
    
    if (!slots || slots.length === 0) {
      console.error("No appointment slots available");
      return;
    }
    setSelectValue({ ...selectValue, slotId: slots._id });
    if (slots) {
      setSelectedStartDate(slots.startDateTime);
      setSelectedEndDate(slots.endDateTime);
    }

    setSelectedSlot(slots);
    fetchData(); // Here the fetchData is called, so the clientId is passed here
    setAppointmentSelected(true); 
  };


  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };


    try {
      const response = await axios.get(
        `https://server-yvzt.onrender.com/api/userauth/${params.clientId}`,
        config
      );
      if (response) {
   
        setUserId(response.data._id);
        setSelectValue(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    next();
  };



  const next = (e) => {
    e.preventDefault();
    setCurrent(current + 1);
    if (current === 0) {
      fetchData();
    }
   
  };

  const prev = () => {
    setCurrent(current - 1);
    
  };

  useEffect(() => {
    const {
      name,
      reasonForVisit,
      startDate,
      endTime,
      nameOnCard,
      cardNumber,
      expiredMonth,
      cardExpiredYear,
      cvv,
    } = selectValue;
    const isInputEmpty = !name || !reasonForVisit;
    setIsDisable(isInputEmpty);
  }, [selectValue, isCheck, selectedEndDate]);

  const makePayment = async () => {
    setLoading(true);
    try {
      const stripe = await loadStripe(
        "pk_live_51OtqzOLau0CG7PIQDrIbt4tfqWZqrbZAsVMtebsCrkfGUcrV2n4fvojNtisvZUznjCc8Igj5iVq4xuCfvSuOJvBO00avLXRVpz"
      );
      const body = {
        products: [{ ...selectedService }],
      };
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        "https://server-yvzt.onrender.com/api/stripe/checkout",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );
      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error("Error redirecting to checkout:", result.error);
      }
    } catch (error) {
      console.error("Error making payment:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isSuccess) {
      message.success("Successfully Appointment Scheduled");
      setSelectValue(initialValue);
      dispatch(addInvoice({ ...appointmentData }));
      navigation(`/booking/success/${appointmentData?.id}`);
    }
    if (isError) {
      message.error(error?.data?.message);
    }
  }, [isSuccess, isError, isLoading, appointmentData]);

  const fetchServiceDetails = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        "https://server-yvzt.onrender.com/api/services",
        config
      );
      setServiceDetails(response.data);
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  useEffect(() => {
    if (serviceDetails) {
      const { serviceAmount, serviceCharge } = serviceDetails;
      const total = serviceAmount + serviceCharge;
      setTotalAmount(total);
    }
  }, [serviceDetails]);

  const handleConfirmAppointment = async () => {
    setLoading(true);
    
    // Prepare the appointment data
    setSelectValue({ ...selectValue, id: userId });
    const {
      attachments = [], name, email, emergencyContact, reasonForVisit,
      gender, address, bloodGroup, image
    } = selectValue;
    const { endDateTime, startDateTime } = selectedSlot;
    const { serviceName, price } = selectedService;
    
    // Create FormData instance
    const appointmentData = new FormData();
    appointmentData.append('id', userId);
    appointmentData.append('name', name);
    appointmentData.append('email', email);
    appointmentData.append('emergencyContact', emergencyContact);
    appointmentData.append('reasonForVisit', reasonForVisit);
    appointmentData.append('image', image);
    appointmentData.append('gender', gender);
    appointmentData.append('address', address);
    appointmentData.append('bloodGroup', bloodGroup);
    appointmentData.append("endDateTime", endDateTime);
    appointmentData.append("startDateTime", startDateTime);
    appointmentData.append("serviceName", serviceName);
    appointmentData.append("price", price);
    
    // Retrieve attachments from local storage
    const savedAttachments = JSON.parse(localStorage.getItem("attachments")) || [];
    
    // Convert base64 attachments to File objects and append to FormData
    if (Array.isArray(savedAttachments) && savedAttachments.length > 0) {
      savedAttachments.forEach((attachment, index) => {
        if (attachment.base64 && typeof attachment.base64 === 'string' && attachment.base64.includes(',')) {
          const [header, data] = attachment.base64.split(',');
          const mimeMatch = header.match(/:(.*?);/);
          if (mimeMatch) {
            const mime = mimeMatch[1];
            const blob = new Blob([new Uint8Array(atob(data).split('').map(char => char.charCodeAt(0)))], { type: mime });
            const file = new File([blob], attachment.name || `file${index}`, { type: mime });
            appointmentData.append("files", file);
          } else {
            console.error('Invalid MIME type');
          }
        } else {
          console.error('Invalid base64 format or missing base64 string');
        }
      });
    } else {
      console.warn('No attachments found in local storage or they are empty');
    }
  
    // Log FormData contents
    console.log("Sending data:", [...appointmentData.entries()]);
  
    const token = localStorage.getItem("token");
  
    try {
      // Send the appointment data
      const response = await axios.post("https://server-yvzt.onrender.com/api/web/", appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Send confirmation email
      const emailResponse = await axios.post("https://server-yvzt.onrender.com/api/send-confirmation-email", { email, name, bloodGroup, emergencyContact, gender }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success("Appointment scheduled successfully!");
  
      // Now, make a request to delete the selected slot
      const appdelete = await axios.delete(`https://server-yvzt.onrender.com/api/schedule/${selectedSlot._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      setShowModal(true);
      setShowAppointmentDetails(true);
  
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setLoading(false); // Set loading state to false once the request is completed
    }
  };
  
  
  
  




  useEffect(() => {
    if (isSuccess) {
      message.success("Successfully Appointment Scheduled");
      setSelectValue(initialValue);
      dispatch(addInvoice({ ...appointmentData }));
      navigation(`/booking/success/${appointmentData?.id}`);
    }
    if (isError) {
      message.error(error?.data?.message);
    }
  }, [isSuccess, isError, isLoading, appointmentData]);

  const steps = [
    {
      title: "Select Appointment Date & Time",
      content: (
        <SelectAppointment
          handleSelectAppointment={handleSelectAppointment}
          appointmentSlots={appointmentSlots}
          patientId={userId}
        />
      ),
    },
    {
      title: "Patient Information",
      content: (
        <PersonalInformation
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          selectValue={selectValue}
          handleConfirmAppointment={handleConfirmAppointment}
          selectedSlot={selectedSlot}
        />
      ),
    },
    {
      title: "Services",
      content: (
        <>
          {serviceDetails && (
            <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexWrap:'wrap'}}>
              {serviceDetails.map((service, index) => (
                <div
                style={{cursor:'pointer'}}
                  key={index}
                  onClick={() => {
                    setSelectedService({
                      serviceName: service.name,
                      price: service.price,
                    });
                    setIsConfirmDisable(false);
                  }}
                  className={`p-4 border rounded-md cursor-pointer transform transition duration-300 hover:scale-105 ${selectedService && selectedService.serviceName === service.name ? 'bg-blue-500 text-black' : 'bg-white text-black'
                    }`}
                >
                  <p className="border bg-blue-4s00 text-base p-2 rounded-md">
                    <span className="font-bold">Service Name:</span> {service.name}<br />
                    <span className="font-bold">Service Price:</span> {service.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Header appointmentSelected={appointmentSelected}/>
      <div className="container" style={{ marginTop: '-10%', bottom: "5rem" }}>
        <div
          className="container"
          style={{ marginBottom: "12rem", marginTop: "8rem" }}
        >
          <Steps current={current} items={items} />
          <div className="mb-5 mt-3 mx-3">{steps[current].content}</div>
          <div className="text-end mx-3">
            {current < steps.length - 1 && (
              <>
                <Button
                  type="primary"
                  size="large"
                  disabled={
                    current === 0
                      ? !(selectedStartDate && selectedEndDate)
                      : isDisable
                  }
                  onClick={next}
                >
                  Next
                </Button>
                {current !== 0 && (
                  <Button size="large" onClick={() => prev()}>
                    Previous
                  </Button>
                )}
              </>
            )}
            {current === steps.length - 1 && (
              <>
                {/* Payment section */}
                <Button
                  type="primary"
                  size="large"
                  style={{ marginRight: "8px" }}
                  disabled={isConfirmDisable || loading}
                  onClick={() => handleConfirmAppointment()}
                >
                  {loading ? (
                    <LoadingOutlined style={{ fontSize: '24px' }} />
                  ) : (
                    <span>Confirm</span>
                  )}
                </Button>
                {/* Previous button */}
                <Button size="large" onClick={() => prev()}>
                  Previous
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal
        title="Appointment Details"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <div>
            <Button
              type="primary"
              size="large"
              style={{ marginRight: "8px" }}
              disabled={isConfirmDisable || loading}
              onClick={() => makePayment()}
            >
              {loading ? (
                <LoadingOutlined style={{ fontSize: '24px' }} />
              ) : (
                <span>checkout</span>
              )}
            </Button>
          
          </div>
        ]}
      >
        <p><b>Patient Name:</b> {selectValue.name} </p>
        <p><b>Service:</b> {selectedService ? selectedService.serviceName : "Loading..."}</p>
        <p>
          <b>Service Charge:</b> {" "}
          {selectedService ? selectedService.price : "Loading..."} USD
        </p>
        <p><b>Total Amount:</b> {selectedService.price} USD</p>
      </Modal>


    </>
  );
};

export default AppointmentPage;