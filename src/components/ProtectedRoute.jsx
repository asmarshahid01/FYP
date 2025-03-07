import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
	return isAuthenticated() ? element : <Navigate to='/login' />;
};

const isAuthenticated = () => {
	//return !!localStorage.getItem("token");
	return true;
};

export default ProtectedRoute;
