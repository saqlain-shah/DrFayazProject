import React, { useState, useEffect, Fragment } from 'react';
import Layout from '../../Layout';
import { patientTab } from '../../components/Datas';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Link, useParams } from "react-router-dom";
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
import PatientDetails from '../../components/PatientDetail/Detail';
function PatientProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({});
  const [webPatientData, setWebPatientData] = useState({});
  const [InvoiceData, setInvoiceData] = useState({});
  const [healthInfoData, setHealthInfoData] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [isDentalModalOpen, setIsDentalModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [error, setError] = useState(null); // Define error state
  const [attachments, setAttachments] = useState([]);
  // Inside PatientProfile component
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const profileResponse = await axios.get(`http://localhost:8800/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(profileResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchWebPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8800/api/web/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWebPatientData(response.data);
        // Set attachments when webPatientData is fetched
        if (response.data.patientInfo && response.data.patientInfo.attachment) {
          setAttachments(response.data.patientInfo.attachment);
        }
      } catch (error) {
        console.error('Error fetching web patient data:', error);
      }
    };

    fetchProfileData();
    fetchWebPatientData();
  }, [id]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const token = localStorage.getItem('token');
      
        const response = await axios.get(`https://server-yvzt.onrender.com/api/medical-records/preview/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // Optionally, you can specify content type if required by the server
          }
        });
       
        setMedicalRecords(response.data);
      } catch (error) {
        console.error('Error fetching medical records:', error);
        setError('Error fetching medical records.');
      }
    };

    fetchMedicalRecords();
  }, [id]);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://server-yvzt.onrender.com/api/invoices/patient/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoiceData(response.data);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };
  
    fetchInvoiceData();
  }, [id]);
  
  useEffect(() => {
    const fetchHealthInformation = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://server-yvzt.onrender.com/api/health-information/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHealthInfoData(response.data);
      } catch (error) {
        console.error('Error fetching health information:', error);
      }
    };
  
    fetchHealthInformation();
  }, [id]);
  

  const openDentalModal = () => {
    setIsDentalModalOpen(true);
  };

  const closeDentalModal = () => {
    setIsDentalModalOpen(false);
  };

  const handleOtpInputChange = (event) => {
    const { value } = event.target;
    setOtpCode(value);
  };

  const verifyOtp = async (otpType) => {
    const email = 'appointment@avicenahealthcare.com'; // Set your desired email address here
 
  
    try {
      const response = await axios.post(
        'http://localhost:8800/api/otp/verify-otp',
        { email: email, otp: otpCode, otpType: otpType }, // Pass otpType along with other data
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
      );
  
     
  
      if (response.status === 200 && response.data.success) { // Check if response is successful
    
        setIsOtpValid(true);
        setIsDentalModalOpen(false);
      } else {
      
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
        'https://server-yvzt.onrender.com/api/otp/send-otp-to-doctor',
        { email: 'appointment@avicenahealthcare.com', otpType: 'dental' }, // Pass otpType
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
      
        openDentalModal();
        setActiveTab(6); // Set the activeTab to 6 after successful OTP sending
      }
    } catch (error) {
      console.error('Error sending OTP to doctor:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };
  

  
  const tabPanel = () => {
   
  
    switch (activeTab) {
      case 1:
        return <MedicalRecord />;
      case 2:
        return <AppointmentsUsed doctor={false} patientId={id} token={localStorage.getItem('token')} />;
      case 3:
        return <InvoiceUsed patientId={id} token={localStorage.getItem('token')} />;
      case 4:
        // return <PaymentsUsed doctor={false} />;
      case 5:
        return  <PatientImages medicalRecords={medicalRecords} webPatientAttachments={attachments} token={localStorage.getItem('token')}  />
  
      case 6:
       
        return isOtpValid ? <DentalChart  /> : null; // Render DentalChart only if OTP is valid
      case 7:
        // return <PatientTableArray data={formatProfileData(profileData, webPatientData)} />;
  
      case 8:
        return <HealthInfomation patientId={id} setHealthInfoData={setHealthInfoData}  />;
        case 9:
          return  <PatientDetails
          medicalRecords={medicalRecords}
          profileData={profileData}
          webPatientData={webPatientData}
          InvoiceData={InvoiceData}
          healthInfoData={healthInfoData}
        />
      default:
        return null;
    }
  };
  

  const formatProfileData = (profileData, webPatientData, healthInfoData) => {
    const formattedData = [];
  
    if (profileData && profileData._id) {
      formattedData.push({
        _id: profileData._id,
        fullName: profileData.fullName,
        gender: profileData.gender,
        bloodGroup: profileData.bloodGroup,
        address: profileData.address,
        email: profileData.email,
        emergencyContact: profileData.emergencyContact,
        createdAt: profileData.createdAt,
        updatedAt: profileData.updatedAt,
        profilePicture: profileData.profilePicture,
        healthInfoData: healthInfoData // Add healthInfoData here
      });
    }
  
    if (webPatientData && webPatientData._id) {
      formattedData.push({
        _id: webPatientData._id,
        fullName: webPatientData.patientInfo ? webPatientData.patientInfo.name : '',
        gender: webPatientData.patientInfo ? webPatientData.patientInfo.gender : '',
        bloodGroup: webPatientData.patientInfo ? webPatientData.patientInfo.bloodGroup : '',
        address: webPatientData.patientInfo ? webPatientData.patientInfo.address : '',
        email: webPatientData.patientInfo ? webPatientData.patientInfo.email : '',
        emergencyContact: webPatientData.patientInfo ? webPatientData.patientInfo.emergencyContact : '',
        createdAt: webPatientData.createdAt,
        healthInfoData: healthInfoData // Add healthInfoData here
      });
    }
  
    return formattedData;
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
          {profileData.fullName ? ( // Check if profileData is available
            <Fragment>
              <img
                src={`http://localhost:8800/${profileData.profilePicture}`}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
              />
              <div className="gap-2 flex-col">
                <h2 className="text-sm font-semibold">{profileData.fullName}</h2>
                <p className="text-xs text-textGray">{profileData.email}</p>
                <p className="text-xs">{profileData.emergencyContact}</p>
              </div>
            </Fragment>
          ) : null}
          {!profileData.fullName && webPatientData && webPatientData.patientInfo ? (
            <Fragment>
              <img
                src={`http://localhost:8800/${webPatientData.patientInfo.image}`}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
              />
              <div className="gap-2 flex-col">
                <h2 className="text-sm font-semibold">{webPatientData.patientInfo.name}</h2>
                <p className="text-xs text-textGray">{webPatientData.patientInfo.email}</p>
                <p className="text-xs">{webPatientData.patientInfo.emergencyContact}</p>
              </div>
            </Fragment>
          ) : null}


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
  onClick={() => verifyOtp('dental')} // Pass otpType as 'dental'
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