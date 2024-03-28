// PrivateRoute.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ element, ...props }) {
    const { user } = useAuth();

    return user ? (
        <Routes>
            <Route {...props} element={element} />
        </Routes>
    ) : (
        <Navigate to="/login" replace />
    );
}

export default PrivateRoute;
