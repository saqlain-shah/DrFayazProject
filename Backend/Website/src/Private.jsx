import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth hook

const PrivateRoute = ({ element, ...props }) => {
    const { user } = useAuth(); // Get the user from the authentication context

    // If the user is authenticated, render the provided element
    // Otherwise, redirect to the login page
    return (
        <Routes>
            <Route {...props}>
                {user ? element : <Navigate to="/login" replace />}
            </Route>
        </Routes>
    );
};

export default PrivateRoute;
