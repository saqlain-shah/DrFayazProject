// import React, { useEffect, useState } from 'react'
// import DashboardLayout from '../DashboardLayout/DashboardLayout'
// import img from '../../../images/doc/doctor 3.jpg';
// import './Appointments.css';
// import { useGetDoctorAppointmentsQuery, useUpdateAppointmentMutation } from '../../../redux/api/appointmentApi';
// import moment from 'moment';
// import { Button, message, Tag, Tooltip } from 'antd';
// import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
// import { Link } from 'react-router-dom';
// import { FaClock, FaEnvelope, FaLocationArrow, FaPhoneAlt, FaBriefcaseMedical } from "react-icons/fa";

// const Appointments = () => {
//     const { data, isError, isLoading } = useGetDoctorAppointmentsQuery({});
//     const [updateAppointment, { isError: updateIsError, isSuccess, error }] = useUpdateAppointmentMutation();

//     const updatedApppointmentStatus = (id, type) => {
//         const changeObj = {
//             status: type
//         }
//         if (id) {
//             updateAppointment({ id, data: changeObj })
//         }
//     }

//     const clickToCopyClipBoard = (id) => {
//         const textField = document.createElement('textarea');
//         textField.innerText = id;
//         document.body.appendChild(textField);
//         textField.select();
//         document.execCommand('copy');
//         document.body.removeChild(textField);
//         message.success("Copied To Clipboard")
//     }

//     useEffect(() => {
//         if (isSuccess) {
//             message.success("Succcessfully Appointment Updated")
//         }
//         if (isError) {
//             message.error(error?.data?.message);
//         }
//     }, [isSuccess, updateIsError, error])

//     let content = null;
//     if (!isLoading && isError) content = <div>Something Went Wrong !</div>
//     if (!isLoading && !isError && data?.length === 0) content = <div>Empty</div>
//     if (!isLoading && !isError && data?.length > 0) content =
//         <>
//             {
//                 data && data.map((item) => (
//                     <div className="w-100 mb-3 rounded p-3" style={{ background: '#f8f9fa' }} key={item.id}>
//                         <div className="d-flex justify-content-between align-items-center">
//                             <div className="d-flex align-items-center gap-3">
//                                 <Link to={`/`} className="patient-img">
//                                     <img src={img} alt="" />
//                                 </Link>
//                                 <div className="patients-info">
//                                     <h5>{item?.patient?.firstName + ' ' + item?.patient?.lastName}</h5>
//                                     <Tooltip title="Copy Tracking Id">
//                                         <Button>
//                                             <h6>Tracking<Tag color="#87d068" className='ms-2 text-uppercase' onClick={() => clickToCopyClipBoard(item?.trackingId)}>{item?.trackingId}</Tag></h6>
//                                         </Button>
//                                     </Tooltip>

//                                     <div className="info">
//                                         <p><FaClock className='icon' /> {moment(item?.appointmentTime).format("MMM Do YY")} </p>
//                                         <p><FaLocationArrow className='icon' /> {item?.patient?.address}</p>
//                                         <p><FaEnvelope className='icon' /> {item?.patient?.email}</p>
//                                         <p><FaPhoneAlt className='icon' /> {item?.patient?.mobile}</p>

//                                     </div>
//                                 </div>
//                                 <div className='appointment-status card p-3 border-primary'>
//                                     <p>Current Status - <Tag color="#f50" className='text-uppercase'>{item?.status}</Tag></p>
//                                     <p>Patient Status - <Tag color="#2db7f5" className='text-uppercase'>{item?.patientType}</Tag></p>
//                                     <p>Is Follow Up - <Tag color="#f50" className='text-uppercase'>{item?.isFollowUp ? "Yes" : "No"}</Tag></p>
//                                     <p> Is Paid - <Tag color="#87d068" className='text-uppercase'>{item?.paymentStatus}</Tag></p>
//                                     <p> Prescribed - <Tag color="#2db7f5" className='text-uppercase'>{item?.prescriptionStatus}</Tag></p>
//                                 </div>
//                                 <div>
//                                 </div>
//                             </div>
//                             <div className='d-flex gap-2'>
//                                 {
//                                     item.prescriptionStatus === 'notIssued'
//                                         ?
//                                         <Link to={`/dashboard/appointment/treatment/${item?.id}`}>
//                                             <Button type="primary" icon={<FaBriefcaseMedical />} size="small">Treatment</Button>
//                                         </Link>

//                                         :
//                                         <Link to={`/dashboard/prescription/${item?.prescription[0]?.id}`}>
//                                             <Button type="primary" shape="circle" icon={<FaEye />} size="small" />
//                                         </Link>

//                                 }
//                                 {
//                                     item?.isFollowUp && <Link to={`/dashboard/appointment/treatment/edit/${item?.prescription[0]?.id}`}>
//                                         <Button type="primary" icon={<FaBriefcaseMedical />} size="small">Follow Up</Button>
//                                     </Link>
//                                 }

//                                 {
//                                     item?.status === 'pending' &&
//                                     <>
//                                         <Button type="primary" icon={<FaCheck />} size="small" onClick={() => updatedApppointmentStatus(item.id, 'scheduled')}>Accept</Button>
//                                         <Button type='primary' icon={<FaTimes />} size="small" danger onClick={() => updatedApppointmentStatus(item.id, 'cancel')}>Cancel</Button>
//                                     </>
//                                 }
//                             </div>
//                         </div>
//                     </div>
//                 ))
//             }
//         </>
//     return (
//         <DashboardLayout>
//             {content}
//         </DashboardLayout>
//     )
// }

// export default Appointments
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import img from '../../../images/doc/doctor 3.jpg';
import moment from 'moment';
import { Button, message, Tag, Tooltip } from 'antd';
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaClock, FaEnvelope, FaLocationArrow, FaPhoneAlt, FaBriefcaseMedical } from "react-icons/fa";

// Dummy data for demonstration
const dummyData = [
    {
        id: 1,
        patient: { firstName: "John", lastName: "Doe", address: "123 Street, City", email: "john@example.com", mobile: "123-456-7890" },
        trackingId: "ABC123",
        appointmentTime: "2024-02-09T12:00:00Z",
        status: "pending",
        patientType: "new",
        isFollowUp: false,
        paymentStatus: "paid",
        prescriptionStatus: "issued",
        prescription: [{ id: 1 }] // Assuming prescription is an array of objects with an id
    },
    // Add more dummy data as needed
];

const Appointments = () => {
    const [appointments, setAppointments] = useState(dummyData);

    const updatedAppointmentStatus = (id, type) => {
        const updatedAppointments = appointments.map(appointment => {
            if (appointment.id === id) {
                return { ...appointment, status: type };
            }
            return appointment;
        });
        setAppointments(updatedAppointments);
    }

    const clickToCopyClipboard = (id) => {
        const textField = document.createElement('textarea');
        textField.innerText = id;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        document.body.removeChild(textField);
        message.success("Copied To Clipboard");
    }

    return (
        <DashboardLayout>
            {appointments.map(item => (
                <div key={item.id} className="w-100 mb-3 rounded p-3" style={{ background: '#f8f9fa' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <Link to={`/`} className="patient-img">
                                <img src={img} alt="" />
                            </Link>
                            <div className="patients-info">
                                <h5>{item.patient.firstName + ' ' + item.patient.lastName}</h5>
                                <Tooltip title="Copy Tracking Id">
                                    <Button>
                                        <h6>Tracking<Tag color="#87d068" className='ms-2 text-uppercase' onClick={() => clickToCopyClipboard(item.trackingId)}>{item.trackingId}</Tag></h6>
                                    </Button>
                                </Tooltip>
                                <div className="info">
                                    <p><FaClock className='icon' /> {moment(item.appointmentTime).format("MMM Do YY")} </p>
                                    <p><FaLocationArrow className='icon' /> {item.patient.address}</p>
                                    <p><FaEnvelope className='icon' /> {item.patient.email}</p>
                                    <p><FaPhoneAlt className='icon' /> {item.patient.mobile}</p>
                                </div>
                            </div>
                            <div className='appointment-status card p-3 border-primary'>
                                <p>Current Status - <Tag color="#f50" className='text-uppercase'>{item.status}</Tag></p>
                                <p>Patient Status - <Tag color="#2db7f5" className='text-uppercase'>{item.patientType}</Tag></p>
                                <p>Is Follow Up - <Tag color="#f50" className='text-uppercase'>{item.isFollowUp ? "Yes" : "No"}</Tag></p>
                                <p> Is Paid - <Tag color="#87d068" className='text-uppercase'>{item.paymentStatus}</Tag></p>
                                <p> Prescribed - <Tag color="#2db7f5" className='text-uppercase'>{item.prescriptionStatus}</Tag></p>
                            </div>
                            <div>
                            </div>
                        </div>
                        <div className='d-flex gap-2'>
                            {item.prescriptionStatus === 'notIssued' ?
                                <Link to={`/dashboard/appointment/treatment/${item.id}`}>
                                    <Button type="primary" icon={<FaBriefcaseMedical />} size="small">Treatment</Button>
                                </Link> :
                                <Link to={`/dashboard/prescription/${item.prescription[0].id}`}>
                                    <Button type="primary" shape="circle" icon={<FaEye />} size="small" />
                                </Link>
                            }
                            {item.isFollowUp &&
                                <Link to={`/dashboard/appointment/treatment/edit/${item.prescription[0].id}`}>
                                    <Button type="primary" icon={<FaBriefcaseMedical />} size="small">Follow Up</Button>
                                </Link>
                            }
                            {item.status === 'pending' &&
                                <>
                                    <Button type="primary" icon={<FaCheck />} size="small" onClick={() => updatedAppointmentStatus(item.id, 'scheduled')}>Accept</Button>
                                    <Button type='primary' icon={<FaTimes />} size="small" danger onClick={() => updatedAppointmentStatus(item.id, 'cancel')}>Cancel</Button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            ))}
        </DashboardLayout>
    )
}

export default Appointments;
