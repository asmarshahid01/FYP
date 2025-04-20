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
import StudentPage from './components/StudentPage';
import TeacherPage from './components/TeacherPage';
import SupervisorHomePage from './components/SupervisorHomePage';
import FypGroupDetails from './components/FypGroupDetails';
import SupervisorLogin from './components/SupervisorLogin';
import AdminHome from './components/AdminHome';
import ReportCheckPage from './components/LatexCheck';

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
				<Route
					path='/'
					element={<ProtectedRoute element={<SupervisorHomePage />} />}
				/>
				<Route
					path='/admin'
					element={<AdminHome />}
				/>
				<Route
					path='/coordinator'
					element={<ReportCheckPage />}
				/>

				<Route path='/inbox' element={<ProtectedRoute element={<Inbox />} />} />
				<Route
					path='/group'
					element={<ProtectedRoute element={<FYPGroupPage />} />}
				/>
				<Route
					path='/supervisorgroup'
					element={<ProtectedRoute element={<FypGroupDetails />} />}
				/>
				<Route
					path='/home'
					element={<ProtectedRoute element={<HomePage />} />}
				/>
				<Route
					path='/profile/:userId'
					element={<ProtectedRoute element={<StudentPage />} />}
				/>
				<Route
					path='/supervisorhome'
					element={<ProtectedRoute element={<SupervisorHomePage />} />}
				/>
				<Route path='/supervisorlogin' element={<SupervisorLogin />} />
				<Route path='/login' element={<LoginPage />} />
			</Routes>
		</Router>
	);
}

export default App;
