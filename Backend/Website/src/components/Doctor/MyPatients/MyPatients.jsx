// // import React from 'react';
// // import img from '../../../images/doc/doctor 3.jpg';
// // import DashboardLayout from '../DashboardLayout/DashboardLayout';
// // import { useGetDoctorPatientsQuery } from '../../../redux/api/appointmentApi';
// // import moment from 'moment';
// // import { Link } from 'react-router-dom';
// // import { FaClock, FaEnvelope, FaLocationArrow, FaPhoneAlt } from "react-icons/fa";

// // const MyPatients = () => {
// //     const { data, isLoading, isError } = useGetDoctorPatientsQuery();
// //     let content = null;
// //     if (!isLoading && isError) content = <div>Something Went Wrong !</div>
// //     if (!isLoading && !isError && data?.length === 0) content = <div>Empty</div>
// //     if (!isLoading && !isError && data?.length > 0) content =
// //         <>
// //             {data && data?.map((item) => (
// //                 <div className="w-100 mb-3 rounded p-3 text-center" style={{ background: '#f8f9fa' }}>
// //                     <div className="">
// //                         <Link to={'/'} className="my-3 patient-img">
// //                             <img src={img} alt="" />
// //                         </Link>
// //                         <div className="patients-info mt-4">
// //                             <h5>{item?.firstName + ' ' + item?.lastName}</h5>
// //                             <div className="info">
// //                                 <p><FaClock className='icon' /> {moment(item?.appointmentTime).format("MMM Do YY")} </p>
// //                                 <p><FaLocationArrow className='icon' /> {item?.address}</p>
// //                                 <p><FaEnvelope className='icon' /> {item?.email}</p>
// //                                 <p><FaPhoneAlt className='icon' /> {item?.mobile}</p>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             ))}
// //         </>
// //     return (
// //         <DashboardLayout>
// //             <div className="row">
// //                 <div className="col-md-6 col-lg-4 col-xl-3">
// //                     {content}
// //                 </div>
// //             </div>
// //         </DashboardLayout>
// //     )
// // }

// // export default MyPatients
// import React from 'react';
// import img from '../../../images/doc/doctor 3.jpg';
// import DashboardLayout from '../DashboardLayout/DashboardLayout';
// import moment from 'moment';
// import { Link } from 'react-router-dom';
// import { FaClock, FaEnvelope, FaLocationArrow, FaPhoneAlt } from "react-icons/fa";

// // Dummy data for demonstration
// const dummyData = [
//     {
//         id: 1,
//         firstName: "Sajjad",
//         lastName: "Hussain",
//         appointmentTime: "2024-02-09T12:00:00Z",
//         address: "123 Street, City",
//         email: "john@example.com",
//         mobile: "123-456-7890"
//     },
//     // Add more dummy data as needed
// ];

// const MyPatients = () => {
//     let content = null;
//     if (dummyData.length === 0) {
//         content = <div>Empty</div>;
//     } else {
//         content = dummyData.map((item) => (
//             <div key={item.id} className="w-100 mb-3 rounded p-3 text-center" style={{ background: '#f8f9fa' }}>
//                 <div className="">
//                     <Link to={'/'} className="my-3 patient-img">
//                         <img src={img} alt="" />
//                     </Link>
//                     <div className="patients-info mt-4">
//                         <h5>{item.firstName + ' ' + item.lastName}</h5>
//                         <div className="info">
//                             <p><FaClock className='icon' /> {moment(item.appointmentTime).format("MMM Do YY")} </p>
//                             <p><FaLocationArrow className='icon' /> {item.address}</p>
//                             <p><FaEnvelope className='icon' /> {item.email}</p>
//                             <p><FaPhoneAlt className='icon' /> {item.mobile}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         ));
//     }

//     return (
//         <DashboardLayout>
//             <div className="row">
//                 <div className="col-md-6 col-lg-4 col-xl-3">
//                     {content}
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };

// export default MyPatients;
