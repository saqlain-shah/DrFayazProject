import React, { useState, useEffect } from "react";
import { MenuSelect } from "../components/Form";
import { FaUserCircle } from "react-icons/fa";

import { TbUser } from "react-icons/tb";
import { AiOutlinePoweroff } from "react-icons/ai";
import { MdOutlineNotificationsNone } from "react-icons/md";
import NotificationComp from "../components/NotificationComp";
import { useNavigate } from "react-router-dom";
import MenuDrawer from "../components/Drawer/MenuDrawer";
import { BiMenu } from "react-icons/bi";
import { useAuth } from "../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import BASE_URL from "../baseUrl.jsx";

function Header() {
  const [notificationsData, setNotificationsData] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Get user ID directly from localStorage
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : "";

  // Toggle drawer
  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  const DropDown1 = [
    {
      title: "Profile",
      icon: TbUser,
      onClick: () => navigate("/settings"),
    },
    {
      title: "Logout",
      icon: AiOutlinePoweroff,
      onClick: () => {
        localStorage.removeItem("token");
        logout();
        navigate("/login");
      },
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token || !userId) {
          console.warn("Token or user ID missing");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/auth/get/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Header user data:", response.data);

        setUserName(response.data.name || "");
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/api/web/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotificationsData(response.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUser();
    fetchNotifications();
  }, [userId]);

  const unreadNotificationsCount = notificationsData.filter(
    (item) => item.status === "Pending"
  ).length;

  return (
    <>
      {isOpen && <MenuDrawer isOpen={isOpen} toggleDrawer={toggleDrawer} />}

      <div className="xl:w-5/6 w-full 2xl:max-w-[1640px] bg-dry grid md:grid-cols-2 grid-cols-12 items-center bg-opacity-95 fixed top-0 z-40 xs:px-8 px-2">
        {/* Left Side */}
        <div className="md:col-span-1 sm:col-span-11 col-span-10 flex gap-4 items-center md:py-0 py-4">
          <button
            onClick={toggleDrawer}
            className="block xl:hidden border text-2xl bg-greyed w-16 md:w-12 h-12 rounded-md flex-colo text-textGray hover:bg-border transition"
          >
            <BiMenu />
          </button>
        </div>

        {/* Right Side */}
        <div className="md:col-span-1 sm:col-span-1 col-span-2 flex justify-end pr-4 md:pr-0">
          <div className="flex gap-4 items-center">

            {/* Notifications */}
            <NotificationComp>
              <div className="relative">
                <MdOutlineNotificationsNone className="text-2xl hover:text-subMain" />
                <span className="absolute -top-2.5 -right-2.5 font-semibold bg-subMain rounded-full px-1.5 py-0.5 text-xs text-white">
                  {unreadNotificationsCount}
                </span>
              </div>
            </NotificationComp>

            {/* User Menu */}
            <div className="items-center md:flex hidden">
              <MenuSelect datas={DropDown1}>
                <div className="flex gap-4 items-center p-4 rounded-lg">

                  {/* User Icon */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border border-dashed border-subMain">
                  <FaUserCircle className="text-3xl text-gray-600" />

                  </div>

                  {/* User Name */}
                  <p className="text-sm text-textGray font-medium">
                    {userName || "NOT SET"}
                  </p>

                </div>
              </MenuSelect>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
