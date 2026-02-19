import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized page or their respective dashboard
        if (user.role === 'CLIENT') {
            return <Navigate to="/client/dashboard" replace />;
        } else if (user.role === 'FREELANCER') {
            return <Navigate to="/freelancer/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
