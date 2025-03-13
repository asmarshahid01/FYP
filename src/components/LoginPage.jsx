import React from 'react';
import loginBg from '../assets/loginBg.jpg';
import { Lock, User } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const loginData = { email, password };
		try {
			const response = await axios.post(
				'http://localhost:4000/api/student/login',
				loginData
			);
			const { token } = response.data;
			if (token) {
				localStorage.setItem('token', token);
				console.log('Token stored');
			}
			navigate('/home');
			console.log('User signed up successfully:', response.data);
		} catch (error) {
			console.error('Error logging in', error);
		}
	};

	return (
		<div className='absolute h-full w-full bg-[#111820] top-0 left-0 overflow-hidden flex items-center justify-center'>
			<img src={loginBg} className='absolute h-full w-full top-0 left-0 z-0' />
			<div className='absolute h-full w-full top-0 left-0 z-10 bg-[#111820ee]'></div>
			<div className='h-[40vh] w-[45vw] bg-[#111820] rounded-sm z-20 shadow-lg flex flex-col items-center justify-center gap-[0.5vh]'>
				<h1 className='font-bold m-[1vw] text-lg'>LOGIN</h1>
				<div className='w-[50%] bg-[#282e3b] rounded-sm flex'>
					<User className='relative left-[0.7vw] top-[0.7vw] text-[#fbfbfb]' />
					<input
						type='text'
						placeholder='l21XXXX@lhr.nu.edu.pk'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={`rounded-sm pl-[1.5vw] pr-[0.8vw] py-[0.5vw] bg-[#282e3b] text-white focus:outline-none text-[0.9vw]`}
					/>
				</div>
				<div className='w-[50%] bg-[#282e3b] rounded-sm flex'>
					<Lock className='relative left-[0.7vw] top-[0.7vw] text-[#fbfbfb]' />
					<input
						type='password'
						placeholder='password'
						email={password}
						onChange={(e) => setPassword(e.target.value)}
						className={`pl-[1.5vw] pr-[0.8vw] py-[0.5vw] text-white focus:outline-none text-[0.9vw]`}
					/>
				</div>
				<button
					className='py-[0.5vw] bg-blue-400 w-[50%] flex align-center justify-center rounded-sm font-bold cursor-pointer mt-[1vh]'
					onClick={handleSubmit}
				>
					Login
				</button>
			</div>
		</div>
	);
}
