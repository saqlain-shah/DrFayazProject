import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import axiosBaseQuery from './axiosBaseQuery';
import { Button, Steps, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import Footer from '../Shared/Footer/Footer';
import Header from '../Shared/Header/Header';
import SelectAppointment from './SelectApppointment';
import PersonalInformation from "../Booking/PersonalInformation";
import CheckoutPage from "../Booking/BookingCheckout/CheckoutPage";
import useAuthCheck from '../../redux/hooks/useAuthCheck';
import { useCreateAppointmentByUnauthenticateUserMutation } from '../../redux/api/appointmentApi';
import { useDispatch } from 'react-redux';
import { addInvoice } from '../../redux/feature/invoiceSlice';

// Define the initial form values
const initialValue = {
  paymentMethod: 'paypal',
  paymentType: 'creditCard',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  reasonForVisit: '',
  description: '',
  address: '',
  nameOnCard: '',
  cardNumber: '',
  expiredMonth: '',
  cardExpiredYear: '',
  cvv: '',
};

const AppointmentPage = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const { data, role } = useAuthCheck();
  const [current, setCurrent] = useState(0);
  const params = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectTime, setSelectTime] = useState('');
  const [isCheck, setIsChecked] = useState(false);
  const [selectValue, setSelectValue] = useState(initialValue);
  const [isDisable, setIsDisable] = useState(true);
  const [isConfirmDisable, setIsConfirmDisable] = useState(true);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [serviceDetails, setServiceDetails] = useState(null); // State to store service details
  const [totalAmount, setTotalAmount] = useState(0); // State to store total amount
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigation = useNavigate();

  const [createAppointmentByUnauthenticateUser, { data: appointmentData, isError, isSuccess, isLoading, error }] = useCreateAppointmentByUnauthenticateUserMutation();

  const handleChange = (e) => {
    setSelectValue({ ...selectValue, [e.target.name]: e.target.value });
  };
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);


  const handleSelectAppointment = (slots, patientId, profileSettingId) => {
    if (!slots || slots.length === 0) {
      console.error('No appointment slots available');
      return;
    }
    const selectedSlotId = slots[0]._id;
    setSelectValue({ ...selectValue, slotId: selectedSlotId });
    const selectedSlot = slots.find(slot => slot._id === selectedSlotId);
    if (selectedSlot) {
      setSelectedDate(selectedSlot.startDateTime);
      setSelectTime(selectedSlot.endDateTime); // Update selectTime with the endDateTime of the selected slot
    }

    console.log('Selected Slot:', selectedSlot); // Log selected slot
    // Here you can fetch the profile setting ID using the profileSettingId parameter
    setSelectedSlot(selectedSlot); // Set the selected slot
  };



  // Before fetching user data
  console.log("Fetching user data...");

  const fetchData = async (params) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get(`http://localhost:8800/api/userauth/${params.clientId}`, config);
      console.log('Response:', response); // Log the entire response
      setUserId(response.data.id); // Update state with the fetched user ID
      console.log("User data fetched successfully:", response.data); // Log user data
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData(params);
  }, []);



  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    const { firstName, reasonForVisit, startDate, endTime, nameOnCard, cardNumber, expiredMonth, cardExpiredYear, cvv } = selectValue;
    const isInputEmpty = !firstName || !reasonForVisit || !startDate || !endTime || !reasonForVisit;
    const isConfirmInputEmpty = !nameOnCard || !cardNumber || !expiredMonth || !cardExpiredYear || !cvv || !isCheck || !selectTime; // Include selectTime in the condition
    setIsDisable(isInputEmpty);
    setIsConfirmDisable(isConfirmInputEmpty);
  }, [selectValue, isCheck, selectTime]); // Include selectTime in the dependency array




  const handleCloseModal = () => {
    console.log("Closing modal...");
    setShowModal(false);
  };


  useEffect(() => {
    if (isSuccess) {
      message.success('Successfully Appointment Scheduled');
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
    try {
      const response = await axios.get('http://localhost:8800/api/services');
      setServiceDetails(response.data);
    } catch (error) {
      console.error('Error fetching service details:', error);
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
    const obj = {
      patientInfo: {
        firstName: selectValue.firstName,
        lastName: selectValue.lastName,
        email: selectValue.email,
        phone: selectValue.phone,
        patientId: role !== '' ? data.id : undefined,
        scheduleDate: selectedDate,
        scheduleTime: selectTime,
      },
      payment: {
        paymentType: selectValue.paymentType,
        paymentMethod: selectValue.paymentMethod,
        cardNumber: selectValue.cardNumber,
        cardExpiredYear: selectValue.cardExpiredYear,
        cvv: selectValue.cvv,
        expiredMonth: selectValue.expiredMonth,
        nameOnCard: selectValue.nameOnCard,
      },
    };

    // Configure Axios to include the token in the Authorization header
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axiosBaseQuery.post('http://localhost:8800/api/v1', obj, config)
      .then(response => {
        console.log('Appointment created successfully:', response.data);
        // Display a success toast message after appointment creation
        // Inside your handleConfirmSchedule function or wherever you want to display a toast message
        toast.success('Appointment scheduled successfully!');

        // Navigate to the first page after confirming
        navigation('/'); // Assuming the first page URL is '/'

        // Handle success, e.g., show a success message to the user
      })
      .catch(error => {
        console.error('Error creating appointment:', error);
        // Handle error, e.g., show an error message to the user
      });

  };

  useEffect(() => {
    if (isSuccess) {
      message.success('Successfully Appointment Scheduled');
      setSelectValue(initialValue);
      dispatch(addInvoice({ ...appointmentData }));
      navigation(`/booking/success/${appointmentData?.id}`);
    }
    if (isError) {
      message.error(error?.data?.message);
    }
  }, [isSuccess, isError, isLoading, appointmentData]);

  console.log("data:", data); // Log the value of data
  const patientId = data && data.id; // Check if data exists before accessing its id property
  console.log("patientId:", patientId);

  const steps = [
    {
      title: 'Select Appointment Date & Time',
      content: <SelectAppointment handleSelectAppointment={handleSelectAppointment} appointmentSlots={appointmentSlots} patientId={userId} />,
    },
    {
      title: 'Patient Information',
      content: <PersonalInformation
        handleChange={handleChange}
        selectValue={selectValue}
        handleConfirmAppointment={handleConfirmAppointment} // Pass the function here
        onNext={next}
        onPrev={prev}
        selectedSlot={selectedSlot} // Pass the selected slot information
      />


    },
    {
      title: 'Payment',
      content: <CheckoutPage
        handleChange={handleChange}
        selectValue={selectValue}
        isCheck={isCheck}
        setIsChecked={setIsChecked}
        data={false}
        selectedDate={selectedDate}
        selectTime={selectTime}
        setIsConfirmDisable={setIsConfirmDisable}
        setIsDisable={setIsDisable}
      />,
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: '8rem', bottom: '5rem' }}>
        <div className="container" style={{ marginBottom: '12rem', marginTop: '8rem' }}>
          <Steps current={current} items={items} />
          <div className="mb-5 mt-3 mx-3">{steps[current].content}</div>
          <div className="text-end mx-3">
            {current < steps.length - 1 && (
              <Button
                type="primary"
                size="large"
                disabled={
                  current === 0
                    ? !(selectedDate && selectTime)
                    : isDisable || !selectedDate || !selectTime
                }
                onClick={next}
              >
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <>
                {/* Payment section */}
                <Button
                  type="primary"
                  size="large"
                  style={{ marginRight: '8px' }}
                  disabled={isConfirmDisable}
                  onClick={() => handleConfirmAppointment()}
                >
                  Confirm
                </Button>
                {/* Previous button */}
                <Button
                  size="large"
                  onClick={() => prev()}
                >
                  Previous
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal
        title="Appointment Details"
        visible={showModal} // Control modal visibility
        onCancel={handleCloseModal} // Handle close event
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
      >
        <p>Patient Name: {selectValue.firstName} {selectValue.lastName}</p>
        <p>Service: {serviceDetails ? serviceDetails.serviceName : 'Loading...'}</p>
        <p>Service Charge: {serviceDetails ? serviceDetails.serviceCharge : 'Loading...'} USD</p>
        <p>Total Amount: {totalAmount} USD</p>
      </Modal>
      <Footer />
    </>
  );
};

export default AppointmentPage;
