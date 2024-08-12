// Frontend: Register Component
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button, Input } from '../components/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import pic from '../build/images/upLogo.jpg';
import { FaTimes } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDentalModalOpen, setIsDentalModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.length < 4) {
      errors.name = 'Name must be at least 4 characters long';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      // First, send OTP email to the predefined email address
      // await sendOtpEmail('appointment@avicenahealthcare.com');
      await sendOtpEmail('davbabu1122@gmail.com'); // Use the predefined email address
      setIsDentalModalOpen(true); // Show OTP verification modal
    } catch (error) {
      console.error('Error sending OTP email:', error);
      toast.error('An error occurred while sending OTP email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOtpEmail = async (targetEmail) => {
    try {
      const response = await axios.post(
        'https://server-yvzt.onrender.com/api/otps/send-otp',

        { email: targetEmail },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 200) {
        console.log('OTP email sent to:', targetEmail);
      } else {
        console.error('Failed to send OTP email:', response.data.message);
      }
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw error;
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleOtpInputChange = (event) => {
    setOtpCode(event.target.value);
  };

  const verifyOtp = async () => {
    console.log('Verifying OTP...');
  
    try {
      const response = await axios.post(
        'https://server-yvzt.onrender.com/api/otps/verify-otp',
        {
          otp: otpCode,
          email: 'appointment@avicenahealthcare.com', // Send the email along with the OTP
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
  
      console.log('OTP Verification Response:', response);
  
      if (response.data.success) {
        console.log('OTP Verified!');
        setIsOtpValid(true);
        setIsDentalModalOpen(false);
        // Proceed with registration after OTP is verified
        await registerUser();
      } else {
        console.log('Failed to verify OTP:', response.data.message);
        toast.error('Invalid OTP code. Please try again.');
        setIsOtpValid(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('An error occurred while verifying OTP. Please try again.');
      setIsOtpValid(false);
    }
  };
  
  

  const registerUser = async () => {
    try {

      const response = await axios.post('https://server-yvzt.onrender.com/api/auth/register', {

        name,
        email,
        password,
      });

      if (response.status === 201) {
        const token = response.data.token;

        // Store the token, name, and email in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);

        document.cookie = `token=${token}; path=/; SameSite=Strict; Secure`;
        toast.success('Registration successful');
        navigate('/login');
      } else {
        console.error('Registration failed:', response.data);
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('An error occurred while registering. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeDentalModal = () => {
    setIsDentalModalOpen(false);
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full h-screen flex-colo bg-dry">
      <form className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo" onSubmit={handleSubmit}>
        <img src={pic} alt="logo" className="w-48 h-26 object-contain" />
        <div className="flex flex-col gap-4 w-full mb-6">
          <Input
            label="Name"
            type="text"
            color={true}
            placeholder={'John Doe'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
          <Input
            label="Email"
            type="email"
            color={true}
            placeholder={'admin@gmail.com'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
          <Input
            label="Password"
            type="password"
            color={true}
            placeholder={'*********'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="text-red-500">{errors.password}</span>}
        </div>
        <div className="flex justify-between items-center">
          <Button
            label={loading ? 'Registering...' : 'Register'}
            Icon={BiLogInCircle}
            disabled={loading}
            type="submit"
          />
        </div>
        <div className="text-center mt-4">
          <span>Already have an account? </span>
          <button className="text-blue-500" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </form>
      <Modal
  isOpen={isDentalModalOpen}
  closeModal={closeDentalModal}
  width="max-w-lg"
  title="Enter OTP Code"
  handleOtpInputChange={handleOtpInputChange}
  verifyOtp={verifyOtp}
  otpCode={otpCode}
/>

    </div>
  );
}

export default Register;
function Modal({ closeModal, isOpen, width, handleOtpInputChange, verifyOtp, otpCode }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${width ? width : 'max-w-4xl'
                  } transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                <div className="w-full flex-btn gap-2 mb-8">
                  <h1 className="text-md font-semibold">Enter OTP Code</h1>
                  <button
                    onClick={closeModal}
                    className="w-14 h-12 bg-dry text-red-600 rounded-md flex-colo"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={handleOtpInputChange}
                    placeholder="Enter OTP Code"
                    className="border border-gray-400 rounded-md p-2 mb-4"
                  />
                  <button
                    onClick={verifyOtp}
                    className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                  >
                    Verify OTP
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

