// useAuthCheck.js
import { useState, useEffect } from 'react';

const useAuthCheck = () => {
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem('token');
        const isAuthenticated = !!authToken;
        setAuthChecked(isAuthenticated);
    }, []); // Run this effect only once on component mount

    return { authChecked };
};

export default useAuthCheck;
