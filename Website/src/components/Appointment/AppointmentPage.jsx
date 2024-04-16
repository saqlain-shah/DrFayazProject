import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import moment from "moment";
import axios from "axios";
import { Link, json, useParams } from "react-router-dom"; // Import useParams
import axiosBaseQuery from "./axiosBaseQuery";
import { Button, Steps, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Footer from "../Shared/Footer/Footer";
import Header from "../Shared/Header/Header";
import SelectAppointment from "./SelectApppointment";
import PersonalInformation from "../Booking/PersonalInformation"; // Import PersonalInformation component
import CheckoutPage from "../Booking/BookingCheckout/CheckoutPage";
import useAuthCheck from "../../redux/hooks/useAuthCheck";
import { useCreateAppointmentByUnauthenticateUserMutation } from "../../redux/api/appointmentApi";
import { useDispatch } from "react-redux";
import { addInvoice } from "../../redux/feature/invoiceSlice";
import { loadStripe } from "@stripe/stripe-js";

// Define the initial form values
const initialValue = {
  // paymentMethod: 'paypal',
  // paymentType: 'creditCard',
  name: "",
  email: "",
  image: "",
  emergencyContact: 0,
  reasonForVisit: "",
  description: "",
  address: "",
};

const AppointmentPage = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  // const { data, role } = useAuthCheck();
  const [current, setCurrent] = useState(0);
  const params = useParams();
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [isCheck, setIsChecked] = useState(false);
  const [selectValue, setSelectValue] = useState(initialValue);
  const [isDisable, setIsDisable] = useState(true);
  const [isConfirmDisable, setIsConfirmDisable] = useState(true);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [serviceDetails, setServiceDetails] = useState([]); // State to store service details
  const [selectedService, setSelectedService] = useState({}); // State to store service details
  const [totalAmount, setTotalAmount] = useState(0); // State to store total amount
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const [
    createAppointmentByUnauthenticateUser,
    { data: appointmentData, isError, isSuccess, isLoading, error },
  ] = useCreateAppointmentByUnauthenticateUserMutation();

  const handleChange = (e) => {
    setSelectValue({ ...selectValue, [e.target.name]: e.target.value });
  };
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  const handleSelectAppointment = (slots, patientId, profileSettingId) => {
    console.log("aponitment details", slots);
    if (!slots || slots.length === 0) {
      console.error("No appointment slots available");
      return;
    }
    // const selectedSlotId = slots._id;
    setSelectValue({ ...selectValue, slotId: slots._id });
    // const selectedSlot = slots.find(slot => slot._id === selectedSlotId);
    if (slots) {
      setSelectedStartDate(slots.startDateTime);
      setSelectedEndDate(slots.endDateTime); // Update SelectedEndDate with the endDateTime of the selected slot
    }

    console.log("Selected Slot:", slots); // Log selected slot
    // Here you can fetch the profile setting ID using the profileSettingId parameter
    setSelectedSlot(slots); // Set the selected slot
  };

  // Before fetching user data
  console.log("Fetching user data...");

  const fetchData = async (params) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `http://localhost:8800/api/userauth/${params.clientId}`,
        config
      );
      if (response) {
        console.log("Response:", response);
        // Log the entire response
        setUserId(response.data._id); // Update state with the fetched user ID
        setSelectValue(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    // Directly move to the next step/page
    next(); // This will move to the next step/page
  };

  // useEffect(() => {
  //   // fetchData(params);
  // }, []);

  const next = (e) => {
    e.preventDefault();
    setCurrent(current + 1);
    if (current !== 2) {
      fetchData(params);
    }
    console.log(current);
  };

  const prev = () => {
    setCurrent(current - 1);
    console.log(current);
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
  }, [selectValue, isCheck, selectedEndDate]); // Include selectedEndDate in the dependency array

  const makePayment = async () => {
    setLoading(true);
    try {
      const stripe = await loadStripe(
        "pk_live_51OtqzOLau0CG7PIQDrIbt4tfqWZqrbZAsVMtebsCrkfGUcrV2n4fvojNtisvZUznjCc8Igj5iVq4xuCfvSuOJvBO00avLXRVpz"
      );
      const body = {
        products: [{ ...selectedService }], // Assuming selectedService contains name and price properties
      };
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        "http://localhost:8800/api/stripe/checkout",
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
        // Handle error, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error making payment:", error);
      // Handle error, e.g., show an error message to the user
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

  // Fetch service details from the backend API
  const fetchServiceDetails = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        "http://localhost:8800/api/services",
        config
      );
      setServiceDetails(response.data);
      console.log("serviceDetails", response.data);
      console.log("serviceDetails", serviceDetails);
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




  const handleConfirmAppointment = () => {
    console.log("Confirming appointment...");
    setShowModal(true); // Show the modal after confirming the appointment
    setShowAppointmentDetails(true);

    // Combine appointment data
    const appointmentData = {
      patientInfo: selectValue, // Personal information
      selectedSlot: selectedSlot, // Selected appointment slot
      selectedService: selectedService, // Selected service
    };

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    // Include ID in the appointment data
    appointmentData.patientInfo.id = userId; // Assuming userId holds the ID

    // Make a POST request to store the appointment data with token included in headers
    axios
      .post("http://localhost:8800/api/web/", appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Appointment created successfully:", response.data);
        // Display a success toast message after appointment creation
        toast.success("Appointment scheduled successfully!");
        // Navigate to the success page or do any further actions
      })
      .catch((error) => {
        console.error("Error creating appointment:", error);
        // Handle error, e.g., show an error message to the user
      });
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

  // console.log("data:", data); // Log the value of data
  // const patientId = data && data.id; // Check if data exists before accessing its id property
  // console.log("patientId:", patientId);

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
          selectValue={selectValue}
          handleConfirmAppointment={handleConfirmAppointment} // Pass the function here
          onNext={next}
          onPrev={prev}
          selectedSlot={selectedSlot} // Pass the selected slot information
        />
      ),
    },
    {
      title: "Services",
      content: (
        <>
          {serviceDetails && (
            <div>
              {serviceDetails.map((service, index) => (
                <div key={index} onClick={() => {
                  setSelectedService({
                    name: service.name,
                    price: service.price,
                  });
                  console.log(selectedService);
                  setIsConfirmDisable(false);
                }} className={` hover:bg-blue-500 p-4 cursor-pointer rounded-md ${selectedService.name === service.name && 'selected-service'}`}>
                  <p className="  border bg-gray-800  text-base">
                    Service Name: {service.name}<br />
                    Service Price: {service.price}
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
      <Header />
      <div className="container" style={{ marginTop: "8rem", bottom: "5rem" }}>
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
                  disabled={isConfirmDisable}
                  onClick={() => handleConfirmAppointment()}
                >
                  Confirm
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
        open={showModal} // Control modal visibility
        // Handle close event
        footer={[
          <div>
            {loading && <div className="loading-circle"></div>},
            <Button key="back" onClick={makePayment}>
              {loading ? 'Processing...' : 'Checkout'}
            </Button>,
          </div>
        ]}
      >
        <p>Patient Name: {selectValue.name} </p>
        <p>Service: {selectedService ? selectedService.name : "Loading..."}</p>
        <p>
          Service Charge:{" "}
          {selectedService ? selectedService.price : "Loading..."} USD
        </p>
        {/* <p>Service Tax: 5 USD</p> */}
        <p>Total Amount: {selectedService.price} USD</p>
      </Modal>
      <Footer />
    </>
  );
};

export default AppointmentPage;
