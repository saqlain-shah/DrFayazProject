import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import axios from 'axios';
import axiosBaseQuery from './axiosBaseQuery';
import { Button, Steps, message } from 'antd';
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
  const { data, role } = useAuthCheck();
  const [current, setCurrent] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectTime, setSelectTime] = useState('');
  const [isCheck, setIsChecked] = useState(false);
  const [selectValue, setSelectValue] = useState(initialValue);
  const [isDisable, setIsDisable] = useState(true);
  const [isConfirmDisable, setIsConfirmDisable] = useState(true);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const navigation = useNavigate();

  const [createAppointmentByUnauthenticateUser, { data: appointmentData, isError, isSuccess, isLoading, error }] = useCreateAppointmentByUnauthenticateUserMutation();

  const handleChange = (e) => {
    setSelectValue({ ...selectValue, [e.target.name]: e.target.value });
  };

  const handleSelectAppointment = (slots) => {
    if (!slots || slots.length === 0) {
      console.error('No appointment slots available');
      return;
    }
    const selectedSlotId = slots[0]._id;
    setSelectValue({ ...selectValue, slotId: selectedSlotId });
    const selectedSlot = slots.find(slot => slot._id === selectedSlotId);
    if (selectedSlot) {
      setSelectedDate(selectedSlot.startDateTime);
      setSelectTime(selectedSlot.endDateTime);
    }
    // Directly move to the next step/page
    next(); // This will move to the next step/page
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    const { firstName, lastName, email, phone, nameOnCard, cardNumber, expiredMonth, cardExpiredYear, cvv, reasonForVisit } = selectValue;
    const isInputEmpty = !firstName || !lastName || !email || !phone || !reasonForVisit;
    const isConfirmInputEmpty = !nameOnCard || !cardNumber || !expiredMonth || !cardExpiredYear || !cvv || !isCheck;
    setIsDisable(isInputEmpty);
    setIsConfirmDisable(isConfirmInputEmpty);
  }, [selectValue, isCheck]);



  const handleConfirmSchedule = () => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Check if the token exists
    if (!token) {
      console.error('No token found in localStorage');
      // Handle the case where no token is found, e.g., redirect to login page
      return;
    }

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

  const steps = [
    {
      title: 'Select Appointment Date & Time',
      content: <SelectAppointment handleSelectAppointment={handleSelectAppointment} appointmentSlots={appointmentSlots} />,
    },
    {
      title: 'Patient Information',
      content: <PersonalInformation
        handleChange={handleChange}
        selectValue={selectValue}
        handleConfirmSchedule={handleConfirmSchedule} // Pass the function here
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
                  onClick={() => handleConfirmSchedule()}
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
      <Footer />
    </>
  );
};

export default AppointmentPage;
