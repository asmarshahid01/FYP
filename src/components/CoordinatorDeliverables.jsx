import React, { useState, useEffect } from 'react';
import CoordinatorLeftBar from './CoordinatorLeftBar';
import axios from 'axios';

const CoordinatorDeliverables = () => {
	const [assignments, setAssignments] = useState([]);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [deadline, setDeadline] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [editModal, setEditModal] = useState(false);
	const [editAssignment, setEditAssignment] = useState(null);
	const token = localStorage.getItem('token');

	const fetchAssignments = async () => {
		setLoading(true);
		try {
			const res = await axios.get('http://localhost:4000/api/assignment', {
				headers: { Authorization: `Bearer ${token}` },
			});
			setAssignments(res.data);
		} catch (err) {
			setError('Failed to fetch assignments');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAssignments();
		// eslint-disable-next-line
	}, []);

	const handleCreate = async (e) => {
		e.preventDefault();
		if (!title.trim() || !description.trim() || !deadline)
			return setError('All fields required');
		setLoading(true);
		try {
			await axios.post(
				'http://localhost:4000/api/assignment',
				{ title, description, deadline },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setTitle('');
			setDescription('');
			setDeadline('');
			fetchAssignments();
		} catch (err) {
			setError('Failed to create assignment');
		} finally {
			setLoading(false);
		}
	};

	const openEditModal = (assignment) => {
		setEditAssignment(assignment);
		setEditModal(true);
	};

	const closeEditModal = () => {
		setEditModal(false);
		setEditAssignment(null);
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		if (
			!editAssignment.title.trim() ||
			!editAssignment.description.trim() ||
			!editAssignment.deadline
		)
			return setError('All fields required');
		setLoading(true);
		try {
			await axios.put(
				`http://localhost:4000/api/assignment/${editAssignment._id}`,
				{
					title: editAssignment.title,
					description: editAssignment.description,
					deadline: editAssignment.deadline,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			closeEditModal();
			fetchAssignments();
		} catch (err) {
			setError('Failed to update assignment');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex h-screen'>
			<CoordinatorLeftBar />
			<div className='flex-1 p-8 text-black'>
				<h1 className='text-2xl font-bold mb-4'>Coordinator Deliverables</h1>
				<form
					onSubmit={handleCreate}
					className='bg-white p-6 rounded shadow mb-8 max-w-xl mx-auto'
				>
					<h2 className='text-xl font-semibold mb-2'>Create Assignment</h2>
					{error && <div className='text-red-500 mb-2'>{error}</div>}
					<input
						type='text'
						placeholder='Assignment Title'
						className='border p-2 rounded w-full mb-2'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<textarea
						placeholder='Description'
						className='border p-2 rounded w-full mb-2'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={3}
					/>
					<input
						type='datetime-local'
						className='border p-2 rounded w-full mb-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-200'
						value={deadline}
						onChange={(e) => setDeadline(e.target.value)}
					/>
					<button
						type='submit'
						className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
						disabled={loading}
					>
						{loading ? 'Saving...' : 'Create'}
					</button>
				</form>

				<h2 className='text-xl font-semibold mb-2'>Assignments</h2>
				{loading && <div>Loading...</div>}
				{assignments.length === 0 && !loading && (
					<div className='text-center'>No assignments yet.</div>
				)}
				<div className='space-y-4 max-w-xl mx-auto'>
					{assignments.map((a) => (
						<div
							key={a._id}
							className='bg-white p-4 rounded shadow flex justify-between items-center'
						>
							<div>
								<div className='font-bold text-lg'>{a.title}</div>
								<div className='text-gray-600 text-sm mb-1'>
									Deadline: {new Date(a.deadline).toLocaleString()}
								</div>
								<div className='text-gray-800'>{a.description}</div>
							</div>
							<button
								className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 ml-4'
								onClick={() => openEditModal(a)}
							>
								Edit
							</button>
						</div>
					))}
				</div>

				{/* Edit Modal */}
				{editModal && (
					<div
						className='fixed inset-0 flex items-center justify-center z-50'
						style={{
							backdropFilter: 'blur(6px)',
							backgroundColor: 'rgba(0,0,0,0.2)',
						}}
					>
						<div className='bg-white p-6 rounded shadow max-w-md w-full'>
							<h2 className='text-xl font-semibold mb-2'>Edit Assignment</h2>
							<input
								type='text'
								placeholder='Assignment Title'
								className='border p-2 rounded w-full mb-2'
								value={editAssignment.title}
								onChange={(e) =>
									setEditAssignment({
										...editAssignment,
										title: e.target.value,
									})
								}
							/>
							<textarea
								placeholder='Description'
								className='border p-2 rounded w-full mb-2'
								value={editAssignment.description}
								onChange={(e) =>
									setEditAssignment({
										...editAssignment,
										description: e.target.value,
									})
								}
								rows={3}
							/>
							<input
								type='datetime-local'
								className='border p-2 rounded w-full mb-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-200'
								value={editAssignment.deadline?.slice(0, 16)}
								onChange={(e) =>
									setEditAssignment({
										...editAssignment,
										deadline: e.target.value,
									})
								}
							/>
							<div className='flex justify-end gap-2'>
								<button
									onClick={closeEditModal}
									className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black'
								>
									Cancel
								</button>
								<button
									onClick={handleEdit}
									className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white'
									disabled={loading}
								>
									{loading ? 'Saving...' : 'Save'}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CoordinatorDeliverables;
