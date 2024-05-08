import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import {
  BsArrowDownLeft,
  BsArrowDownRight,
  BsArrowUpRight,
  BsCheckCircleFill,
  BsClockFill,
  BsXCircleFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { TbCalendar, TbFile } from "react-icons/tb";

import { MdOutlineAttachMoney } from "react-icons/md";

import { DashboardBigChart, DashboardSmallChart } from "../components/Charts";
import {
  appointmentsData,
  memberData,
  transactionData,
} from "../components/Datas";
import { Transactiontables } from "../components/Tables";
import {
  fetchTotalPatientCount,
  fetchTotalWebPatientCount,
  fetchRecentPatients,
  fetchWebPatientTodayAppointments,
  fetchwebsitePatient,
  fetchTotalEarnings
} from "../Api/api.js"; // Import all necessary functions

function Dashboard() {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPatientsPercentage, setTotalPatientsPercentage] = useState(0);
  const [recentPatients, setRecentPatients] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [websitePatients, setWebsitePatients] = useState([]);
  const [totalWebPatients, setTotalWebPatients] = useState(0);
  const [webPatientsPercentage, setWebPatientsPercentage] = useState(0); // State for web patients percentage
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [earningsPercent, setEarningsPercent] = useState(0);
  useEffect(() => {
    console.log("Dashboard component mounted");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("Fetching data...");

      const { totalCount: patientCount, percentage: patientPercentage } =
        await fetchTotalPatientCount();
      setTotalPatients(patientCount);
      setTotalPatientsPercentage(patientPercentage);

      const recentPatientsData = await fetchRecentPatients();
      setRecentPatients(recentPatientsData);

      const websitePatientsData = await fetchwebsitePatient(); // Assuming you have the patient's id available
      setWebsitePatients(websitePatientsData);

      const { totalCount: webPatientCount, percentage: webPatientsPercentage } =
        await fetchTotalWebPatientCount();
      setTotalWebPatients(webPatientCount);
      setWebPatientsPercentage(webPatientsPercentage);

      const todayWebAppointmentsData = await fetchWebPatientTodayAppointments(); // Fetch today's web appointments
      setTodayAppointments(todayWebAppointmentsData);

      const { totalEarnings, percent } = await fetchTotalEarnings(); // Destructure totalEarnings and percent from fetchTotalEarnings result
      setTotalEarnings(totalEarnings);
      setEarningsPercent(percent);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? "AM" : "PM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  };

  const dashboardCards = [
    {
      id: 1,
      title: "Total Patient",
      icon: BsCheckCircleFill,
      value: totalPatients,
      percent: totalPatientsPercentage,
      color: ["bg-subMain", "text-subMain", "#66B5A3"],
      datas: [totalPatients],
    },
    {
      id: 2,
      title: "Total Appointments",
      icon: TbCalendar,
      value: totalWebPatients,
      percent: webPatientsPercentage, // Use webPatientsPercentage here
      color: ["bg-yellow-500", "text-yellow-500", "#F9C851"],
      datas: [totalWebPatients],
    },

    {
      id: 4,
      title: "Total Earnings",
      icon: MdOutlineAttachMoney,
      value: totalEarnings, // Use totalEarnings state here
      percent: earningsPercent, // This can be dynamic too if fetched from API
      color: ["bg-red-500", "text-red-500", "#FF3B30"],
      datas: [totalEarnings],
    },
  ];
  return (
    <Layout>
      {/* boxes */}
      <div className="w-full grid xl:grid-cols-3 gap-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {dashboardCards.map((card, index) => (
          <div
            key={card.id}
            className=" bg-white rounded-xl border-[1px] border-border p-5"
          >
            <div className="flex gap-4 items-center">
              <div
                className={`w-10 h-10 flex-colo bg-opacity-10 rounded-md ${card.color[1]} ${card.color[0]}`}
              >
                <card.icon />
              </div>
              <h2 className="text-sm font-medium">{card.title}</h2>
            </div>
            <div className="grid grid-cols-8 gap-4 mt-4 bg-dry py-5 px-8 items-center rounded-xl">
              <div className="col-span-5">
                {/* statistc */}
                <DashboardSmallChart data={card.datas} colors={card.color[2]} />
              </div>
              <div className="flex flex-col gap-4 col-span-3">
                <h4 className="text-md font-medium">
                  {card.value}
                  {
                    // if the id === 4 then add the $ sign
                    card.id === 4 ? "$" : "+"
                  }
                </h4>
                <p className={`text-sm flex gap-2 ${card.color[1]}`}>
                  {card.percent > 50 && <BsArrowUpRight />}
                  {card.percent > 30 && card.percent < 50 && (
                    <BsArrowDownRight />
                  )}
                  {card.percent < 30 && <BsArrowDownLeft />}
                  {card.percent}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full my-6 grid xl:grid-cols-8 grid-cols-1 gap-6">
        <div className="xl:col-span-6  w-full">
          <div className="bg-white rounded-xl border-[1px] border-border p-5">
            <div className="flex-btn gap-2">
            <h2 className="text-sm font-medium">Earning Reports</h2>
<p className="flex gap-4 text-sm items-center">
  {totalEarnings} 
  <span className="py-1 px-2 bg-subMain text-white text-xs rounded-xl">
    {earningsPercent}%
  </span>
</p>
            </div>
            {/* Earning Reports */}
            <div className="mt-4">
              <DashboardBigChart />
            </div>
          </div>
          {/* transaction */}
          <div className="mt-6 bg-white rounded-xl border-[1px] border-border p-5">
            {/* <div className="flex-btn gap-2">
              <h2 className="text-sm font-medium">Recent Transaction</h2>
              <p className="flex gap-4 text-sm items-center">
                Today{" "}
                <span className="py-1 px-2 bg-subMain text-white text-xs rounded-xl">
                  27000$
                </span>
              </p>
            </div> */}
            {/* table */}
            <div className="mt-4  overflow-x-hidden">
              <Transactiontables data={websitePatients} action={true} />
            </div>
          </div>
        </div>
        {/* side 2 */}
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="10"
          data-aos-offset="200"
          className="xl:col-span-2 xl:block grid sm:grid-cols-2 gap-6"
        >
          {/* recent patients */}
          <div className="bg-white rounded-xl border-[1px] border-border p-5">
            <h2 className="text-sm font-medium">Recent Patients</h2>
            {recentPatients.map((patient, index) => (
              <Link
                to={`/patients/preview/${patient._id}`} // Assuming _id is the unique identifier
                key={index}
                className="flex-btn gap-4 mt-6 border-b pb-4 border-border"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={`https://server-yvzt.onrender.com /${patient.profilePicture}`} // Adjust the URL according to your backend configuration
                    alt="patient"
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-medium">{patient.fullName}</h3>
                    <p className="text-xs text-gray-400">{patient.email}</p>
                  </div>
                </div>
                <p className="text-[12px] font-light text-textGray">
                  {formatTime(patient.createdAt)} -{" "}
                  {formatTime(patient.updatedAt)}
                </p>
              </Link>
            ))}
          </div>
          {/* today apointments */}

          <div className="bg-white rounded-xl border-[1px] border-border p-5 xl:mt-6">
            <h2 className="text-sm mb-4 font-medium">Today Appointments</h2>
            {todayAppointments.map((appointment, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <p className="text-textGray text-[12px] col-span-3 font-light">
                  {formatTime(appointment.selectedSlot.startDateTime)} -{" "}
                  {formatTime(appointment.selectedSlot.endDateTime)}
                </p>
                <div className="flex-colo relative col-span-2">
                  <hr className="w-[2px] h-20 bg-border" />
                  <div
                    className={`w-7 h-7 flex-colo text-sm bg-opacity-10 ${
                      appointment.status === "Pending" &&
                      "bg-orange-500 text-orange-500"
                    } ${
                      appointment.status === "Cancel" &&
                      "bg-red-500 text-red-500"
                    } ${
                      appointment.status === "Approved" &&
                      "bg-green-500 text-green-500"
                    } rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                  >
                    {appointment.status === "Pending" && <BsClockFill />}
                    {appointment.status === "Cancel" && <BsXCircleFill />}
                    {appointment.status === "Approved" && <BsCheckCircleFill />}
                  </div>
                </div>
                <div className="flex flex-col gap-1 col-span-7">
                  <h2 className="text-xs font-medium">
                    {appointment.patientInfo.name}
                  </h2>
                  <p className="text-[12px] font-light text-textGray">
                    {appointment.patientInfo.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
