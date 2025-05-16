import React, { useState, useEffect } from 'react';
import CoordinatorLeftBar from './CoordinatorLeftBar';
import axios from 'axios';

const Checker = () => {
	const [tab, setTab] = useState('automatic');
	const [assignments, setAssignments] = useState([]);
	const [checking, setChecking] = useState(false);
	const [selectedDeliverable, setSelectedDeliverable] = useState('');
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

	const handleDownload = async (assignmentId, title) => {
		try {
			// Create a safe directory name from the assignment title
			const safeDirName = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

			// Make a request to download all files in the assignment directory
			const response = await axios.get(
				`http://localhost:4000/api/assignment/download/${assignmentId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
					responseType: 'blob',
				}
			);

			// Create a blob from the response data
			const blob = new Blob([response.data], { type: 'application/zip' });

			// Create a download link and trigger the download
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${safeDirName}_submissions.zip`;
			document.body.appendChild(link);
			link.click();

			// Clean up
			window.URL.revokeObjectURL(url);
			document.body.removeChild(link);
		} catch (error) {
			console.error('Error downloading submissions:', error);
			alert('Failed to download submissions. Please try again.');
		}
	};

	const getCheckerKey = (title) => {
		title = title.toLowerCase();
		if (title.includes('fyp 1 deliverable 2')) return '1d2';
		if (title.includes('fyp 1 deliverable 3')) return '1d3';
		if (title.includes('fyp 2 deliverable 1')) return '2d1';
		if (
			title.includes('fyp 2 deliverable 2') ||
			title.includes('fyp 2 final report')
		)
			return '2d2';
		return null;
	};

	const handleCheck = async (assignmentId, title) => {
		const checkerKey = getCheckerKey(title);
		if (!checkerKey) {
			alert('This checker is only for FYP 1/2 deliverables and reports.');
			return;
		}

		setChecking(true);
		try {
			// Call the backend to run the appropriate checker
			const response = await axios.post(
				`http://localhost:4000/api/assignment/check/${assignmentId}`,
				{ checkerKey },
				{
					headers: { Authorization: `Bearer ${token}` },
					responseType: 'blob',
				}
			);

			// Create a blob from the response data
			const blob = new Blob([response.data], { type: 'text/csv' });

			// Create a download link and trigger the download
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${title
				.replace(/[^a-z0-9]/gi, '_')
				.toLowerCase()}_results.csv`;
			document.body.appendChild(link);
			link.click();

			// Clean up
			window.URL.revokeObjectURL(url);
			document.body.removeChild(link);
		} catch (error) {
			console.error('Error checking submissions:', error);
			alert('Failed to check submissions. Please try again.');
		} finally {
			setChecking(false);
		}
	};

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
										<button
											className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700'
											onClick={() => handleDownload(a._id, a.title)}
										>
											Download
										</button>
										<button
											className={`bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 ${
												checking ? 'opacity-50 cursor-not-allowed' : ''
											}`}
											onClick={() => handleCheck(a._id, a.title)}
											disabled={checking}
										>
											{checking ? 'Checking...' : 'Check'}
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				{tab === 'manual' && (
					<div className='max-w-xl mx-auto flex flex-col items-center'>
						<div className='w-full mb-6'>
							<h3 className='text-lg font-semibold mb-3'>
								Select Deliverable Type:
							</h3>
							<div className='space-y-2'>
								<label className='flex items-center space-x-2'>
									<input
										type='radio'
										name='deliverable'
										value='fyp1d2'
										checked={selectedDeliverable === 'fyp1d2'}
										onChange={(e) => setSelectedDeliverable(e.target.value)}
										className='form-radio text-blue-600'
									/>
									<span>FYP 1 Deliverable 2</span>
								</label>
								<label className='flex items-center space-x-2'>
									<input
										type='radio'
										name='deliverable'
										value='fyp1d3'
										checked={selectedDeliverable === 'fyp1d3'}
										onChange={(e) => setSelectedDeliverable(e.target.value)}
										className='form-radio text-blue-600'
									/>
									<span>FYP 1 Deliverable 3</span>
								</label>
								<label className='flex items-center space-x-2'>
									<input
										type='radio'
										name='deliverable'
										value='fyp2d1'
										checked={selectedDeliverable === 'fyp2d1'}
										onChange={(e) => setSelectedDeliverable(e.target.value)}
										className='form-radio text-blue-600'
									/>
									<span>FYP 2 Deliverable 1</span>
								</label>
								<label className='flex items-center space-x-2'>
									<input
										type='radio'
										name='deliverable'
										value='fyp2d2'
										checked={selectedDeliverable === 'fyp2d2'}
										onChange={(e) => setSelectedDeliverable(e.target.value)}
										className='form-radio text-blue-600'
									/>
									<span>FYP 2 Deliverable 2</span>
								</label>
							</div>
						</div>
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
