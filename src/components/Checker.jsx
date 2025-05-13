import React, { useState, useEffect } from 'react';
import CoordinatorLeftBar from './CoordinatorLeftBar';
import axios from 'axios';

const Checker = () => {
	const [tab, setTab] = useState('automatic');
	const [assignments, setAssignments] = useState([]);
	const token = localStorage.getItem('token');

	useEffect(() => {
		const fetchAssignments = async () => {
			try {
				const res = await axios.get('http://localhost:4000/api/assignment', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setAssignments(res.data);
			} catch (err) {
				setAssignments([]);
			}
		};
		fetchAssignments();
	}, [token]);

	return (
		<div className='flex h-screen'>
			<CoordinatorLeftBar />
			<div className='flex-1 p-8 text-black bg-gray-50 w-screen'>
				<h1 className='text-2xl font-bold mb-4'>Checker</h1>
				<div className='flex mb-8 border-b border-gray-200'>
					<button
						className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 ${
							tab === 'automatic'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-blue-600'
						}`}
						onClick={() => setTab('automatic')}
					>
						Automatic
					</button>
					<button
						className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 ${
							tab === 'manual'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-blue-600'
						}`}
						onClick={() => setTab('manual')}
					>
						Manual
					</button>
				</div>

				{tab === 'automatic' && (
					<div className='max-w-xl mx-auto'>
						<h2 className='text-lg font-semibold mb-4'>Assignments</h2>
						{assignments.length === 0 && (
							<div className='text-gray-500'>No assignments found.</div>
						)}
						<ul className='space-y-4'>
							{assignments.map((a) => (
								<li
									key={a._id}
									className='flex justify-between items-center bg-white p-4 rounded shadow'
								>
									<span className='font-medium'>{a.title}</span>
									<div className='flex gap-2'>
										<button className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700'>
											Download
										</button>
										<button className='bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700'>
											Check
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				{tab === 'manual' && (
					<div className='max-w-xl mx-auto flex flex-col items-center'>
						<label
							htmlFor='manual-upload'
							className='w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg h-64 cursor-pointer bg-white hover:bg-blue-50 transition mb-4'
						>
							<span className='text-gray-500 text-lg'>Upload file/files</span>
							<input
								id='manual-upload'
								type='file'
								multiple
								className='hidden'
							/>
						</label>
					</div>
				)}
			</div>
		</div>
	);
};

export default Checker;
