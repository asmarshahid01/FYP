import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
	return isAuthenticated() ? element : <Navigate to='/login' />;
};

const isAuthenticated = () => {
	console.log(localStorage.getItem('token'));
	return !!localStorage.getItem('token');
};

export default ProtectedRoute;
