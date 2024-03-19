import React, { useState } from 'react';
import Layout from '../Layout';
import { BiUserPlus } from 'react-icons/bi';
import { RiLockPasswordLine } from "react-icons/ri";
import DoctorInfo from './Doctors/DoctorInfo';
import ChangePassword from '../components/UsedComp/ChangePassword';
import Header from '../Layout/Header';

function Settings() {
  const [activeTab, setActiveTab] = useState(1);
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));

  const handleSave = (data) => {
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data)); // Update localStorage with new user data
  };
  const tabs = [
    {
      id: 1,
      name: "Personal Information",
      icon: BiUserPlus,
    },
    {
      id: 2,
      name: "Change Password",
      icon: RiLockPasswordLine,
    },
  ];

  const closeModal = () => {
    // Implement the logic to close the modal
  };



  const renderProfilePicture = () => {
    if (userData && userData.profileImage) {
      const profileImageUrl = `http://localhost:8800/${userData.profileImage}`;
      return (
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
        />
      );
    }
    return null;
  };

  const tabPanel = () => {
    switch (activeTab) {
      case 1:
        return <DoctorInfo onSave={handleSave} closeModal={closeModal} />;
      case 2:
        return <ChangePassword />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Header fullName={userData?.fullName} profileImage={userData?.profileImage} />
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="grid grid-cols-12 gap-6 my-8 items-start">
        <div className="col-span-12 flex-col gap-6 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28">
          {userData && (
            <>
              {renderProfilePicture()}
              <div className="gap-2 flex-col">
                <h2 className="text-sm font-semibold">{userData.fullName}</h2>
                <p className="text-xs text-textGray">{userData.email}</p>
                <p className="text-xs">{userData.phone}</p>
              </div>
            </>
          )}

          <div className="flex-col gap-3 px-2 xl:px-12 w-full">
            {tabs.map((tab, index) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                key={index}
                className={`
                  ${activeTab === tab.id
                    ? "bg-text text-subMain"
                    : "bg-dry text-main hover:bg-text hover:text-subMain"
                  }
                  text-xs gap-4 flex items-center w-full p-4 rounded`}
              >
                <tab.icon className="text-lg" /> {tab.name}
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

export default Settings;
