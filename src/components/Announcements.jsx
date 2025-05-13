import React, { useEffect, useState } from 'react';
import CoordinatorLeftBar from './CoordinatorLeftBar';
import axios from 'axios';

const Announcements = () => {
	const [announcements, setAnnouncements] = useState([]);
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const token = localStorage.getItem('token');

	const fetchAnnouncements = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await axios.get(
				'http://localhost:4000/api/coordinator/announcements',
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setAnnouncements(res.data);
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

	const handlePost = async (e) => {
		e.preventDefault();
		if (!content.trim()) return;
		setLoading(true);
		setError('');
		try {
			await axios.post(
				'http://localhost:4000/api/coordinator/announcements',
				{ content },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setContent('');
			fetchAnnouncements();
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Delete this announcement?')) return;
		setLoading(true);
		setError('');
		try {
			await axios.delete(
				`http://localhost:4000/api/coordinator/announcements/${id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setAnnouncements((prev) => prev.filter((a) => a._id !== id));
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex h-screen'>
			<CoordinatorLeftBar />
			<div className='flex-1 p-8 text-black'>
				<h1 className='text-2xl font-bold mb-4'>Announcements</h1>
				<form onSubmit={handlePost} className='mb-6 flex gap-2 items-start'>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder='Write a new announcement...'
						className='border rounded px-3 py-2 flex-1 min-h-[100px] resize-y'
						disabled={loading}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								handlePost(e);
							}
						}}
					/>
					<button
						type='submit'
						className='bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 h-10'
						disabled={loading || !content.trim()}
					>
						Post
					</button>
				</form>
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
							<button
								onClick={() => handleDelete(a._id)}
								className='text-red-600 hover:underline text-sm ml-4'
								disabled={loading}
							>
								Delete
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Announcements;
