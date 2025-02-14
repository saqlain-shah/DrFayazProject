import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth hook

const PrivateRoute = ({ element, ...props }) => {
    const { user } = useAuth();
    return (
        <Routes>
            <Route {...props}>
                {user ? element : <Navigate to="/login" replace />}
            </Route>
        </Routes>
    );
};

export default PrivateRoute;
