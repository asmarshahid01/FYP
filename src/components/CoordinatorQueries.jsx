import React, { useState, useEffect } from 'react';
import CoordinatorLeftBar from './CoordinatorLeftBar';
import axios from 'axios';

const CoordinatorQueries = () => {
	const [queries, setQueries] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [replyText, setReplyText] = useState('');
	const [selectedQuery, setSelectedQuery] = useState(null);
	const token = localStorage.getItem('token');

	const fetchQueries = async () => {
		setLoading(true);
		try {
			const res = await axios.get('http://localhost:4000/api/query/all', {
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

	const openReplyModal = (query) => {
		setSelectedQuery(query);
		setReplyText('');
		setModalOpen(true);
	};

	const closeReplyModal = () => {
		setModalOpen(false);
		setSelectedQuery(null);
		setReplyText('');
	};

	const handleReply = async (e) => {
		e.preventDefault();
		if (!replyText.trim() || !selectedQuery) return;
		try {
			await axios.patch(
				`http://localhost:4000/api/query/${selectedQuery._id}/reply`,
				{ reply: replyText },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			closeReplyModal();
			fetchQueries();
		} catch (err) {
			setError('Failed to send reply');
		}
	};

	return (
		<div className='flex absolute h-full w-full top-0 left-0'>
			<CoordinatorLeftBar />
			<div className='flex-1 p-8 text-black bg-gray-50'>
				<h1 className='text-2xl font-bold mb-4'>Coordinator Queries</h1>
				{error && <div className='text-red-500 mb-2'>{error}</div>}
				{loading ? (
					<div>Loading...</div>
				) : queries.length === 0 ? (
					<div>No queries found.</div>
				) : (
					<div className='space-y-4 max-w-2xl'>
						{queries.map((q) => (
							<div
								key={q._id}
								className={`p-4 rounded shadow border ${
									q.resolved
										? 'bg-green-100 border-green-400'
										: 'bg-white border-gray-300'
								}`}
							>
								<div className='font-semibold mb-1'>
									{q.author?.name || 'Unknown'} ({q.authorModel})
								</div>
								<div className='text-gray-800 mb-2'>{q.content}</div>
								<div className='text-xs text-gray-500 mb-2'>
									Submitted: {new Date(q.createdAt).toLocaleString()}
								</div>
								{q.resolved ? (
									<div className='mt-2'>
										<div className='text-green-700 font-semibold'>
											Reply: {q.reply}
										</div>
										<div className='text-xs text-gray-500'>
											Resolved by Coordinator
										</div>
									</div>
								) : (
									<button
										className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition'
										onClick={() => openReplyModal(q)}
									>
										Reply
									</button>
								)}
							</div>
						))}
					</div>
				)}

				{/* Modal for replying */}
				{modalOpen && (
					<div className='fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50'>
						<div className='bg-white p-6 rounded shadow-lg w-full max-w-md'>
							<h2 className='text-xl font-bold mb-4'>Reply to Query</h2>
							<form onSubmit={handleReply}>
								<textarea
									value={replyText}
									onChange={(e) => setReplyText(e.target.value)}
									className='w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400'
									rows={4}
									placeholder='Type your reply here...'
									required
								/>
								<div className='flex justify-end gap-2'>
									<button
										type='button'
										className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black'
										onClick={closeReplyModal}
									>
										Cancel
									</button>
									<button
										type='submit'
										className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white'
									>
										Send Reply
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CoordinatorQueries;
