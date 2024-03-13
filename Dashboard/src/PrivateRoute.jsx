// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ element: Element, ...rest }) {
    const { user } = useAuth();

    return (
        <Route
            {...rest}
            element={user ? <Element /> : <Navigate to="/login" replace />}
        />
    );
}

export default PrivateRoute;
