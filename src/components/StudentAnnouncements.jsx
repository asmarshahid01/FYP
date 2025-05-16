import React, { useEffect, useState } from 'react';
import LeftSideBar from './LeftSideBar';
import axios from 'axios';

const StudentAnnouncements = () => {
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const token = localStorage.getItem('token');

	const fetchAnnouncements = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await axios.get(
				'http://localhost:4000/api/coordinator/all-announcements',
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setAnnouncements(res.data);
			console.log(res.data);
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAnnouncements();
		// eslint-disable-next-line
	}, []);

	return (
		<div className='flex absolute h-full w-full top-0 left-0'>
			<LeftSideBar />
			<div className='flex-1 p-8 text-black'>
				<h1 className='text-2xl font-bold mb-4'>Announcements</h1>
				{error && <div className='text-red-600 mb-4'>{error}</div>}
				{loading && <div>Loading...</div>}
				<ul className='space-y-4'>
					{announcements.map((a) => (
						<li
							key={a._id}
							className='border rounded p-4 flex justify-between items-start'
						>
							<div className='flex-1'>
								<div className='font-medium text-black whitespace-pre-wrap'>
									{a.content}
								</div>
								<div className='text-xs text-gray-700 mt-2'>
									{new Date(a.createdAt).toLocaleString()}
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default StudentAnnouncements;
