// import { useEffect, useState } from "react";
// import { useGetDoctorQuery } from "../api/doctorApi";
// import { useGetPatientQuery } from "../api/patientApi";
// import { getUserInfo } from '../../service/auth.service';

// export default function useAuthCheck() {
//     const [authChecked, setAuthChecked] = useState(false);
//     const [userId, setUserId] = useState('');
//     const [isSkip, setIsSkip] = useState(true);
//     const [data, setData] = useState({});
//     const [role, setRole] = useState("");
//     const { data: doctorData, isError, isSuccess: dIsSuccess } = useGetDoctorQuery(userId, { skip: isSkip });
//     const { data: patientData, isError: pIsError, isSuccess: pIsSuccess } = useGetPatientQuery(userId, { skip: isSkip });

//     useEffect(() => {
//         const localAuth = getUserInfo();

//         if (localAuth && localAuth !== null) {
//             if (localAuth.role === 'patient') {
//                 setUserId(localAuth?.userId)
//                 setIsSkip(false);
//                 setData(patientData)
//                 setRole(localAuth.role)
//                 setAuthChecked(pIsSuccess && !pIsError)
//             } else if (localAuth.role === 'doctor') {
//                 setUserId(localAuth?.userId)
//                 setIsSkip(false);
//                 setData(doctorData)
//                 setRole(localAuth.role)
//                 setAuthChecked(dIsSuccess && !isError)
//             }
//         }
//     }, [patientData, doctorData, isError, dIsSuccess, pIsError, pIsSuccess]);

//     return {
//         authChecked,
//         data,
//         role
//     };
// }
import { useState, useEffect } from 'react';
import { getUserData } from '../services/authService'; // Example service function to fetch user data

const useAuthCheck = () => {
    const [authChecked, setAuthChecked] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Perform authentication check
        const isAuthenticated = console.log("isAuthenticated", isAuthenticated);

        if (isAuthenticated) {
            // If authenticated, fetch user data
            getUserData() // Example function to fetch user data
                .then(data => {
                    setUserData(data);
                    setAuthChecked(true);
                })
                .catch(error => {
                    // Handle error if user data cannot be fetched
                    console.error('Error fetching user data:', error);
                    setAuthChecked(true); // Still mark authentication as checked even if there's an error
                });
        } else {
            // If not authenticated, mark authentication as checked
            setAuthChecked(true);
        }
    }, []);

    return { authChecked, userData };
};

export default useAuthCheck;
