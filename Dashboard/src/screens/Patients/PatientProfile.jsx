import React, { useState, useEffect } from 'react';
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
import DentalChart from "./DentalChart";
import axios from 'axios';
import { PatientTableArray } from '../../components/Tables';

function PatientProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8800/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [id]);

  const tabPanel = () => {
    switch (activeTab) {
      case 1:
        return <MedicalRecord />;
      case 2:
        return <AppointmentsUsed doctor={false} />;
      case 3:
        return <InvoiceUsed />;
      case 4:
        return <PaymentsUsed doctor={false} />;
      case 5:
        return <PatientImages />;
      case 6:
        return <DentalChart />;
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
            src={`http://localhost:8800/${profileData.profilePicture}`}
            alt="profile"
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
                onClick={() => setActiveTab(tab.id)}
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
    </Layout>
  );
}

export default PatientProfile;
