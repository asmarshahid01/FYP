import { useState } from 'react';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from 'react-router-dom';
import HomePage from './components/HomePage';
import Inbox from './components/Inbox';
import FYPGroupPage from './components/fypgroup';
import LoginPage from './components/LoginPage';

// function App() {
// 	return (
// 		<HomePage></HomePage>
// 		// <Inbox></Inbox>
// 		//<FYPGroupPage></FYPGroupPage>
// 		//<LoginPage></LoginPage>
// 	);
// }

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<ProtectedRoute element={<HomePage />} />} />
				<Route path='/inbox' element={<ProtectedRoute element={<Inbox />} />} />
				<Route
					path='/group'
					element={<ProtectedRoute element={<FYPGroupPage />} />}
				/>
				<Route
					path='/home'
					element={<ProtectedRoute element={<HomePage />} />}
				/>
				<Route
					path='/login'
					element={<ProtectedRoute element={<LoginPage />} />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
