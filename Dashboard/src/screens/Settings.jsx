import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { BiUserPlus } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import ChangePassword from "../components/UsedComp/ChangePassword";
import Header from "../Layout/Header";
import { useLocation } from "react-router-dom";
import BASE_URL from "../baseUrl.jsx";
import { Button, Input } from "../components/Form";
import { HiOutlineCheckCircle } from "react-icons/hi";

function Settings() {
  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setId] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return parsedUser ? parsedUser.id : "";
  });
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState(""); // Store image URL
  const [selectedFile, setSelectedFile] = useState(null); // Store actual file

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`${BASE_URL}/api/auth/get/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.name || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setAddress(data.address || "");
          setProfileImage(
            data.profileImage ? `${BASE_URL}/${data.profileImage}` : ""
          );
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const tabs = [
    { id: 1, name: "Personal Information", icon: BiUserPlus },
    { id: 2, name: "Change Password", icon: RiLockPasswordLine },
  ];
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    const apiEndpoint = `${BASE_URL}/api/auth/user/${id}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("User updated successfully:", data);
        setProfileImage(
          data.imageUrl ? `${BASE_URL}/${data.imageUrl}` : profileImage
        );
        setSelectedFile(null);
      } else {
        console.error("Error updating user:", data);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const renderProfilePicture = () => {
    return (
      <div className="flex justify-center items-center flex-col">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
            onError={(e) => (e.target.src = "/default-profile.png")} // Fallback image
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center border border-dashed border-subMain">
            <span className="text-2xl text-gray-600">👤</span>
          </div>
        )}
        <div className="gap-2 flex-col text-center mt-4">
          <h2 className="text-sm font-semibold">{name}</h2>
          <p className="text-xs text-textGray">{email}</p>
          <p className="text-xs">{phone}</p>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div className="flex-col gap-4">
        <Input
          label="Full Name"
          type="text"
          value={name}
          color="true"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Phone Number"
          type="text"
          color="true"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          color="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Address"
          type="text"
          color="true"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div>
          <p className="text-sm">Profile Image</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <br />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Button
            label={"Save Changes"}
            Icon={HiOutlineCheckCircle}
            onClick={handleSave}
          />
        </div>
      </div>
    );
  };

  const tabPanel = () => {
    switch (activeTab) {
      case 1:
        return "Personal Information";
      case 2:
        return "Change Password";
      default:
        return "";
    }
  };

  return (
    <Layout>
    <Header name={name} profileImage={profileImage} />
    <h1 className="text-xl font-semibold">Settings</h1>

    <div className="grid grid-cols-12 gap-6 my-8 items-start">
      <div className="col-span-12 flex-col gap-6 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28">
        {renderProfilePicture()}
        <h2 className="text-center text-lg font-semibold mt-4">{tabPanel()}</h2>

        {/* Tab Navigation */}
        <div className="flex-col gap-3 px-2 xl:px-12 w-full">
          {tabs.map((tab, index) => (
            <button
              onClick={() => setActiveTab(tab.id)}
              key={index}
              className={`${
                activeTab === tab.id
                  ? "bg-text text-subMain"
                  : "bg-dry text-main hover:bg-text hover:text-subMain"
              } text-xs gap-4 flex items-center w-full p-4 rounded`}
            >
              <tab.icon className="text-lg" /> {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Right Section (Actual Form Content) */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border-[1px] border-border p-6">
        {activeTab === 1 && renderForm()}
        {activeTab === 2 && <ChangePassword />}
      </div>
    </div>
  </Layout>
  );
}

export default Settings;
