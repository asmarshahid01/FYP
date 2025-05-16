import React, { useState, useEffect } from 'react';
import LeftSideBar from './LeftSideBar';
import axios from 'axios';

const Queries = () => {
	const [query, setQuery] = useState('');
	const [queries, setQueries] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const token = localStorage.getItem('token');

	const fetchQueries = async () => {
		setLoading(true);
		try {
			const res = await axios.get('http://localhost:4000/api/query/my', {
				headers: { Authorization: `Bearer ${token}` },
			});
			setQueries(res.data);
		} catch (err) {
			setError('Failed to fetch queries');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchQueries();
		// eslint-disable-next-line
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!query.trim()) return;
		try {
			await axios.post(
				'http://localhost:4000/api/query',
				{ content: query },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setQuery('');
			fetchQueries();
		} catch (err) {
			setError('Failed to submit query');
		}
	};

	return (
		<div className='flex absolute h-full w-full top-0 left-0'>
			<LeftSideBar />
			<div className='flex-1 p-8 text-black'>
				<h1 className='text-2xl font-bold mb-4'>Your Queries</h1>
				<form onSubmit={handleSubmit} className='mb-6 flex gap-2'>
					<input
						type='text'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Type your query here...'
						className='flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400'
					/>
					<button
						type='submit'
						className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
					>
						Submit
					</button>
				</form>
				{error && <div className='text-red-500 mb-2'>{error}</div>}
				{loading ? (
					<div>Loading...</div>
				) : queries.length === 0 ? (
					<div>No previous queries.</div>
				) : (
					<div className='space-y-4'>
						{queries.map((q) => (
							<div
								key={q._id}
								className={`bg-white p-4 rounded shadow border ${
									q.resolved
										? 'bg-green-100 border-green-400'
										: 'border-gray-300'
								}`}
							>
								<div className='text-gray-800'>{q.content}</div>
								<div className='text-xs text-gray-500 mt-1'>
									Submitted: {new Date(q.createdAt).toLocaleString()}
								</div>
								{q.resolved && (
									<div className='mt-2'>
										<div className='text-green-700 font-semibold'>
											Reply: {q.reply}
										</div>
										<div className='text-xs text-gray-500'>Resolved</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Queries;
