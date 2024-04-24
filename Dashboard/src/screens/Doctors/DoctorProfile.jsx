// DoctorProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link, useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import Layout from '../../Layout';
import DoctorInfo from './DoctorInfo';
import PatientsUsed from '../../components/UsedComp/PatientsUsed';
import AppointmentsUsed from '../../components/UsedComp/AppointmentsUsed';
import { doctorTab } from '../../components/Datas';

function DoctorProfile() {
  const [activeTab, setActiveTab] = useState(1);
  const [doctorData, setDoctorData] = useState(null);
  const location = useLocation();
  const { doctorId } = useParams();

  useEffect(() => {
    if (location.state && location.state.doctorData) {
      setDoctorData(location.state.doctorData);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://server-yvzt.onrender.com/api/doctors/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched doctor data:", response.data);
        setDoctorData(response.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    if (doctorId) {
      console.log("Fetching doctor data for doctor ID:", doctorId);
      fetchDoctorData();
    }
  }, [doctorId]);

  const tabPanel = () => {
    switch (activeTab) {
      case 1:
        return <DoctorInfo doctorData={doctorData} />;
      case 2:
        return <PatientsUsed />;
      case 3:
        return <AppointmentsUsed token={localStorage.getItem('token')} />; // Pass token to AppointmentsUsed
      case 4:
        return <PaymentsUsed />;
      case 5:
        return <InvoiceUsed />;
      case 6:
        return <Access />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to="/doctors"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">{doctorData ? `Dr. ${doctorData.fullName}` : 'Doctor Profile'}</h1>
      </div>
      <div className="grid grid-cols-12 gap-6 my-8 items-start">
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28 flex items-center justify-center flex-col">
          <img
            src={`https://server-yvzt.onrender.com/${doctorData ? doctorData.profileImage : '/images/user1.png'}`}
            alt="Doctor"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
          />

          <div className="gap-2 flex-col">
            <h2 className="text-sm font-semibold">{doctorData ? `Dr. ${doctorData.fullName}` : 'Loading...'}</h2>
            <p className="text-xs text-textGray">{doctorData ? doctorData.email : 'Loading...'}</p>
            <p className="text-xs">{doctorData ? doctorData.phone : 'Loading...'}</p>
          </div>
          {/* tabs */}
          <div className="flex flex-col gap-3 px-2 xl:px-12 w-full">
            {doctorTab.map((tab, index) => (
              <button
                key={index}
                className={`
                  ${activeTab === tab.id ? 'bg-text text-subMain' : 'bg-dry text-main hover:bg-text hover:text-subMain'}
                  text-xs gap-4 flex items-center w-full p-4 rounded`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="text-lg" /> {tab.title}
              </button>
            ))}
          </div>
        </div>
        {/* tab panel */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border-[1px] border-border p-6">
          {tabPanel()}
        </div>
      </div>
    </Layout>
  );
}

export default DoctorProfile;
