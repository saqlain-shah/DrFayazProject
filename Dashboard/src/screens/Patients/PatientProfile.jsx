import React, { useState, useEffect, Fragment } from 'react';
import Layout from '../../Layout';
import { patientTab } from '../../components/Datas';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Link, Navigate, useParams } from "react-router-dom";
import MedicalRecord from "./MedicalRecord";
import AppointmentsUsed from "../../components/UsedComp/AppointmentsUsed";
import InvoiceUsed from "../../components/UsedComp/InvoiceUsed";
import PaymentsUsed from "../../components/UsedComp/PaymentUsed";
import PatientImages from "./PatientImages";
import HealthInfomation from "./HealthInfomation";
import DentalChart from "./DentalChart"; // Import DentalChart component
import axios from 'axios';
import { PatientTableArray } from '../../components/Tables';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';

function PatientProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [isDentalModalOpen, setIsDentalModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  // Inside PatientProfile component
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`https://drfayazproject.onrender.com/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [id]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token in PatientProfile component:', token);
        console.log('Fetching medical records...');
        const response = await axios.get(`https://drfayazproject.onrender.com/api/medical-records/preview/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // Optionally, you can specify content type if required by the server
          }
        });
        console.log('Medical records response:', response.data);
        setMedicalRecords(response.data);
      } catch (error) {
        console.error('Error fetching medical records:', error);
        setError('Error fetching medical records.');
      }
    };

    fetchMedicalRecords();
  }, [id]);


  const openDentalModal = () => {
    setIsDentalModalOpen(true);
  };

  const closeDentalModal = () => {
    setIsDentalModalOpen(false);
  };

  const handleOtpInputChange = (event) => {
    setOtpCode(event.target.value);
  };

  const verifyOtp = async () => {
    console.log('Verifying OTP...');

    try {
      const response = await axios.post(
        'https://drfayazproject.onrender.com/api/otp/verify-otp',
        { email: 'davabu1122@gmail.com', otp: otpCode },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      console.log("OTP Verification Response:", response);

      if (response.status === 200) {
        console.log('OTP Verified!');
        setIsOtpValid(true);
        closeDentalModal();
      } else {
        console.log('Failed to verify OTP:', response.data.message);
        alert('Invalid OTP code. Please try again.');
        setIsOtpValid(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred while verifying OTP. Please try again.');
      setIsOtpValid(false);
    }
  };


  const handleMentalHealthTabClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://drfayazproject.onrender.com/api/otp/send-otp-to-doctor',
        { email: 'davabu1122@gmail.com' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        console.log('OTP sent successfully');
        openDentalModal();
        setActiveTab(6); // Set the activeTab to 6 after successful OTP sending
      }
    } catch (error) {
      console.error('Error sending OTP to doctor:', error);
    }
  };



  const tabPanel = () => {
    console.log("Active Tab:", activeTab);

    switch (activeTab) {
      case 1:
        return <MedicalRecord />;
      case 2:
        return <AppointmentsUsed doctor={false} patientId={id} token={localStorage.getItem('token')} />;
      case 3:
        return <InvoiceUsed patientId={id} token={localStorage.getItem('token')} />;
      case 4:
        return <PaymentsUsed doctor={false} />;
      case 5:
        return <PatientImages medicalRecords={medicalRecords} token={localStorage.getItem('token')} />

      case 6:
        console.log("Rendering DentalChart...");
        return isOtpValid ? <DentalChart /> : null;
      case 7:
        return <PatientTableArray data={formatProfileData(profileData)} />;
      case 8:
        return <HealthInfomation />;
      default:
        return null;
    }
  };

  const formatProfileData = (data) => {
    return [
      {
        _id: data._id,
        fullName: data.fullName,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        address: data.address,
        email: data.email,
        emergencyContact: data.emergencyContact,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        profilePicture: data.profilePicture
      }
    ];
  };

  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link to="/patients" className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md">
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">{profileData.fullName}</h1>
      </div>
      <div className="grid grid-cols-12 gap-6 my-8 items-start">
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28 flex flex-col items-center justify-center">
          <img
            src={`https://drfayazproject.onrender.com/${profileData.profilePicture}`}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
          />
          <div className="gap-2 flex-col">
            <h2 className="text-sm font-semibold">{profileData.fullName}</h2>
            <p className="text-xs text-textGray">{profileData.email}</p>
            <p className="text-xs">{profileData.emergencyContact}</p>
          </div>

          <div className="flex-col gap-3 px-2 xl:px-12 w-full">
            {patientTab.map((tab, index) => (
              <button
                onClick={tab.id === 6 ? handleMentalHealthTabClick : () => setActiveTab(tab.id)}
                key={index}
                className={`${activeTab === tab.id ? 'bg-text text-subMain' : 'bg-dry text-main hover:bg-text hover:text-subMain'} text-xs gap-4 flex items-center w-full p-4 rounded`}
              >
                <tab.icon className="text-lg" /> {tab.title}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border-[1px] border-border p-6">
          {tabPanel()}
        </div>
      </div>

      {/* Dental Modal */}
      <Modal
        isOpen={isDentalModalOpen}
        closeModal={closeDentalModal}
        width="max-w-lg"
        title="Enter OTP Code"
      >
        {/* Content of the Dental Modal */}
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
      </Modal>
    </Layout>
  );
}

export default PatientProfile;

function Modal({ closeModal, isOpen, width, children, title }) {
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
                  <h1 className="text-md font-semibold">{title}</h1>
                  <button
                    onClick={closeModal}
                    className="w-14 h-12 bg-dry text-red-600 rounded-md flex-colo"
                  >
                    <FaTimes />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

