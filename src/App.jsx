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
import CoordinatorLogin from './components/CoordinatorLogin';
import SupervisorHomePage from './components/SupervisorHomePage';
import FypGroupDetails from './components/FypGroupDetails';
import SupervisorLogin from './components/SupervisorLogin';
import AdminHome from './components/AdminHome';
import ReportCheckPage from './components/LatexCheck';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { LoaderProvider } from './context/LoaderContext';
import 'react-overlay-loader/styles.css';
import AdminAddAccounts from './components/AdminAddAccounts';
import CoordinatorHomePage from './components/CoordinatorHomePage';
import Announcements from './components/Announcements';
import Checker from './components/Checker';
import CoordinatorQueries from './components/CoordinatorQueries';
import CoordinatorDeliverables from './components/CoordinatorDeliverables';
import Queries from './components/Queries';
import Deliverables from './components/Deliverables';
import SocketProvider from './context/SocketContext';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
// function App() {
// 	return (
// 		<HomePage></HomePage>
// 		// <Inbox></Inbox>
// 		//<FYPGroupPage></FYPGroupPage>
// 		//<LoginPage></LoginPage>
// 	);
// }

const userId=JSON.parse(localStorage.getItem("userdetails"));
console.log("CHEKING HEERe",userId);

function App() {
	return (

		<LoaderProvider>
			<Router>
				<Routes>
					<Route
						path='/'
						element={<ProtectedRoute element={<SupervisorHomePage />} />}
					/>
					<Route path='/admin' element={<AdminHome />} />
					<Route path='/adminAccounts' element={<AdminAddAccounts />} />
					<Route path='/coordinator' element={<ReportCheckPage />} />

					<Route
						path='/inbox'
						element={<ProtectedRoute element={<Inbox />} />}
					/>
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
					<Route path='/coordinatorlogin' element={<CoordinatorLogin />} />
					<Route path='/login' element={<LoginPage />} />
					<Route
						path='/announcements'
						element={<ProtectedRoute element={<Announcements />} />}
					/>
					<Route
						path='/checker'
						element={<ProtectedRoute element={<Checker />} />}
					/>
					<Route
						path='/coordinatorqueries'
						element={<ProtectedRoute element={<CoordinatorQueries />} />}
					/>
					<Route
						path='/coordinatordeliverables'
						element={<ProtectedRoute element={<CoordinatorDeliverables />} />}
					/>
					<Route
						path='/queries'
						element={<ProtectedRoute element={<Queries />} />}
					/>
					<Route
						path='/deliverables'
						element={<ProtectedRoute element={<Deliverables />} />}
					/>
				</Routes>
				<ToastContainer
					position='bottom-right'
					autoClose={3000}
					closeOnClick
					theme='colored'
				/>
			</Router>
		</LoaderProvider>
	);
}

export default App;
