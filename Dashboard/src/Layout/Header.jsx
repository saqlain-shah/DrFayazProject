import React, { useState, useEffect } from "react";
import { MenuSelect } from "../components/Form";
import { TbUser } from "react-icons/tb";
import { AiOutlinePoweroff } from "react-icons/ai";
import { MdOutlineNotificationsNone } from "react-icons/md";
import NotificationComp from "../components/NotificationComp";
import { useNavigate } from "react-router-dom";
import MenuDrawer from "../components/Drawer/MenuDrawer"; // Import the MenuDrawer component
import { BiMenu } from "react-icons/bi";
import { useAuth } from "../AuthContext"; // Import the useAuth hook
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import BASE_URL from "../baseUrl.jsx";

function Header() {
  const [notificationsData, setNotificationsData] = useState([]);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get the logout function from useAuth
  const [id, setId] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return parsedUser ? parsedUser.id : "";
  }); // Retrieve user ID from local storage
  const [isOpen, setIsOpen] = React.useState(false);

  // toggle drawer
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const DropDown1 = [
    {
      title: "Profile",
      icon: TbUser,
      onClick: () => {
        navigate("/settings");
      },
    },
    {
      title: "Logout",
      icon: AiOutlinePoweroff,
      onClick: () => {
        localStorage.removeItem("token");
        logout(); // Call the logout function from useAuth
        navigate("/login");
      },
    },
  ];

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem("token");
    
        if (!token) {
          console.error("Token not found. Please login again.");
          return;
        }
    
        if (id) {
          const response = await axios.get(`${BASE_URL}/api/auth/get/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          const { profileImage, name } = response.data;
    
          // Construct the full URL for the profile image
          const imageUrl = profileImage ? `${BASE_URL}/${profileImage}` : "";
    
          setProfileImage(imageUrl);
          setUserName(name);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/web/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotificationsData(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchProfileImage();
    fetchNotifications();
  }, [id]);

  // const profileImage = profileImage
  // ? `${BASE_URL}${profileImage}`  // Use the correct path for the image
  // : null;
  const unreadNotificationsCount = notificationsData.filter(
    (item) => item.status === "Pending"
  ).length;

  return (
    <>
      {/* Header content */}
      {isOpen && <MenuDrawer isOpen={isOpen} toggleDrawer={toggleDrawer} />}

      {/* cmp */}
      <div className="xl:w-5/6 w-full 2xl:max-w-[1640px] bg-dry grid md:grid-cols-2 grid-cols-12 items-center bg-opacity-95 fixed top-0 z-40 xs:px-8 px-2">
        <div className="md:col-span-1 sm:col-span-11 col-span-10 flex gap-4 items-center md:py-0 py-4">
          <button
            onClick={toggleDrawer}
            className="block xl:hidden border text-2xl bg-greyed w-16 md:w-12 h-12 rounded-md flex-colo text-textGray transitions hover:bg-border"
          >
            <BiMenu />
          </button>
        </div>
        {/* User information */}
        <div className="md:col-span-1 sm:col-span-1 col-span-2 items-center justify-end pr-4 md:pr-0">
          <div className="float-right flex gap-4 items-center justify-center">
            <NotificationComp>
              <div className="relative">
                <MdOutlineNotificationsNone className="text-2xl hover:text-subMain" />
                <span className="absolute -top-2.5 -right-2.5 font-semibold bg-subMain rounded-full px-1.5 py-0.5 text-xs text-white text-center">
                  {unreadNotificationsCount}
                </span>
              </div>
            </NotificationComp>

            <div className=" items-center md:flex hidden">
              <MenuSelect datas={DropDown1}>
                <div className="flex gap-4 items-center p-4 rounded-lg">
                  {/* Profile Image */}
                  {profileImage ? (
                    <img
                    src={profileImage}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border border-dashed border-subMain"
                  />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center border border-dashed border-subMain">
                      <span className="text-xl text-gray-600">👤</span>{" "}
                      {/* Default Icon */}
                    </div>
                  )}

                  {/* Display user's name */}
                  <p className="text-sm text-textGray font-medium">
                    {userName}
                  </p>
                </div>
              </MenuSelect>
            </div>

            {/* Toggle menu drawer button */}
            <button
              className="md:hidden block"
              onClick={() => setShowDrawer(!showDrawer)}
            >
              {/* You can add an icon for the menu drawer toggle */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
