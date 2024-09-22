import  { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
        return false; // No token found in localStorage
    }

    try {
        const decodedToken = jwtDecode(storedToken);
        const userRole = decodedToken.role;
        return userRole !== null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false; // Error decoding token
    }
};

const ProtectedRoute = ({ children, requiredRole }) => {
    const userAuthenticated = isAuthenticated();

    if (!userAuthenticated) {
        // If user is not authenticated (token issue) or role does not match, redirect to home or login page
        return <Navigate to="/" />;
    }

    // Check if user's role matches the required role for access
    const userRole = jwtDecode(localStorage.getItem('token')).role;
    if (userRole !== requiredRole) {
        // Redirect if user role does not match required role
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
