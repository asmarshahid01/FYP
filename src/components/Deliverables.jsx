import React, { useState, useEffect } from 'react';
import LeftSideBar from './LeftSideBar';
import axios from 'axios';

const Deliverables = () => {
	const [assignments, setAssignments] = useState([]);
	const [submissions, setSubmissions] = useState({}); // { [assignmentId]: { files: [], submittedAt } }
	const [selectedFiles, setSelectedFiles] = useState({}); // { [assignmentId]: File[] }
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [uploading, setUploading] = useState({}); // { [assignmentId]: boolean }
	const [unsubmitting, setUnsubmitting] = useState({}); // { [assignmentId]: boolean }
	const token = localStorage.getItem('token');

	// Fetch assignments and submissions
	const fetchAssignments = async () => {
		setLoading(true);
		try {
			const res = await axios.get('http://localhost:4000/api/assignment', {
				headers: { Authorization: `Bearer ${token}` },
			});
			setAssignments(res.data);
			// Fetch student submissions from backend
			const subRes = await axios.get(
				'http://localhost:4000/api/assignment/submissions',
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log('Raw submissions response:', subRes.data);

			// Map submissions by assignmentId
			const subMap = {};
			subRes.data.forEach((submission) => {
				if (submission.assignment && submission.assignment._id) {
					const assignmentId = submission.assignment._id;
					subMap[assignmentId] = {
						files: submission.files,
						submittedAt: submission.submittedAt,
					};
				}
			});

			console.log('Final submissions map:', subMap);
			setSubmissions(subMap);
		} catch (err) {
			console.error('Error fetching submissions:', err);
			console.error('Error details:', {
				message: err.message,
				response: err.response?.data,
				status: err.response?.status,
			});
			setError('Failed to fetch assignments or submissions');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAssignments();
		// eslint-disable-next-line
	}, []);

	// Handle file select
	const handleFileChange = (assignmentId, files) => {
		// Store selected files separately from submissions
		setSelectedFiles((prev) => ({
			...prev,
			[assignmentId]: Array.from(files),
		}));
	};

	// Handle submit (real API)
	const handleSubmit = async (assignmentId) => {
		const files = selectedFiles[assignmentId];
		if (!files || files.length === 0) return;

		setUploading((prev) => ({ ...prev, [assignmentId]: true }));
		try {
			const formData = new FormData();
			files.forEach((file) => {
				formData.append('files', file);
			});
			formData.append('assignmentId', assignmentId);

			const response = await axios.post(
				'http://localhost:4000/api/assignment/submit',
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			console.log('Submit response:', response.data);

			if (response.data.submissions) {
				// Clear the selected files after successful submission
				setSelectedFiles((prev) => ({
					...prev,
					[assignmentId]: [],
				}));
			}

			// Refresh submissions
			await fetchAssignments();
		} catch (err) {
			console.error('Error submitting files:', err);
			setError(err.response?.data?.error || 'Failed to submit deliverable');
		} finally {
			setUploading((prev) => ({ ...prev, [assignmentId]: false }));
		}
	};

	// Handle unsubmit (real API)
	const handleUnsubmit = async (assignmentId) => {
		console.log('Starting unsubmit process for assignment:', assignmentId);
		console.log('Current submissions state:', submissions);

		setUnsubmitting((prev) => ({ ...prev, [assignmentId]: true }));
		try {
			// Get all submission IDs for this assignment
			const submissionIds =
				submissions[assignmentId]?.files?.map((file) => file._id) || [];
			console.log('Found submission IDs to unsubmit:', submissionIds);

			// Unsubmit all files at once
			console.log('Sending unsubmit request with data:', {
				assignmentId,
				submissionIds,
			});

			const response = await axios.delete(
				'http://localhost:4000/api/assignment/unsubmit',
				{
					headers: { Authorization: `Bearer ${token}` },
					data: {
						assignmentId,
						submissionIds,
					},
				}
			);

			console.log('Unsubmit response:', response.data);

			// Refresh submissions
			console.log('Refreshing submissions after unsubmit');
			await fetchAssignments();
		} catch (err) {
			console.error('Error unsubmitting files:', err);
			console.error('Error details:', {
				message: err.message,
				response: err.response?.data,
				status: err.response?.status,
			});
			setError('Failed to unsubmit deliverable');
		} finally {
			setUnsubmitting((prev) => ({ ...prev, [assignmentId]: false }));
		}
	};

	const now = new Date();

	return (
		<div className='flex absolute h-full w-full top-0 left-0 bg-darkgray-100'>
			<LeftSideBar />
			<div className=' p-[0.5vw] text-black'>
				<h1 className='text-2xl font-bold mb-4'>Student Deliverables</h1>
				{error && <div className='text-red-500 mb-2'>{error}</div>}
				{loading ? (
					<div>Loading...</div>
				) : assignments.length === 0 ? (
					<div className='text-center'>No deliverables yet.</div>
				) : (
					<div className='space-y-6 max-w-xl mx-auto'>
						{assignments.map((a) => {
							const deadline = new Date(a.deadline);
							const isBeforeDeadline = now < deadline;
							const submission = submissions[a._id];
							const hasSelectedFiles = selectedFiles[a._id]?.length > 0;

							return (
								<div key={a._id} className='bg-white p-4 rounded shadow'>
									<div className='font-bold text-lg'>{a.title}</div>
									<div className='text-gray-600 text-sm mb-1'>
										Deadline: {deadline.toLocaleString()}
									</div>
									<div className='text-gray-800 mb-2'>{a.description}</div>
									{submission && submission.files ? (
										<div className='mb-2'>
											<div className='text-green-700 font-semibold mb-2'>
												Submitted on:{' '}
												{submission.submittedAt
													? new Date(submission.submittedAt).toLocaleString()
													: ''}
											</div>
											<div className='space-y-2'>
												{submission.files.map((file, index) => (
													<div
														key={index}
														className='flex items-center space-x-2'
													>
														<svg
															className='h-5 w-5 text-gray-600'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
															/>
														</svg>
														<a
															href={`http://localhost:4000${file.fileUrl}`}
															target='_blank'
															rel='noopener noreferrer'
															className='text-blue-600 hover:text-blue-800'
														>
															View File {index + 1}
														</a>
													</div>
												))}
											</div>
											{isBeforeDeadline ? (
												<button
													onClick={() => handleUnsubmit(a._id)}
													className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mt-2 disabled:opacity-50'
													disabled={unsubmitting[a._id]}
												>
													{unsubmitting[a._id] ? 'Unsubmitting...' : 'Unsubmit'}
												</button>
											) : (
												<div className='text-gray-400 mt-2'>
													Deadline passed. Cannot unsubmit.
												</div>
											)}
										</div>
									) : (
										<div className='flex flex-col gap-2'>
											<div className='relative'>
												<input
													type='file'
													accept='.pdf,.doc,.docx,.zip,.rar,.7z,.tex,.txt'
													onChange={(e) =>
														handleFileChange(a._id, e.target.files)
													}
													disabled={!isBeforeDeadline}
													multiple
													className='hidden'
													id={`file-upload-${a._id}`}
												/>
												<label
													htmlFor={`file-upload-${a._id}`}
													className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
														isBeforeDeadline
															? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
															: 'bg-gray-400 cursor-not-allowed'
													}`}
												>
													<svg
														className='-ml-1 mr-2 h-5 w-5'
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
														/>
													</svg>
													Choose Files
												</label>
											</div>

											{hasSelectedFiles && (
												<div className='mt-2'>
													<div className='text-sm text-gray-600 mb-2'>
														Selected files:
													</div>
													<ul className='space-y-1'>
														{selectedFiles[a._id].map((file, index) => (
															<li
																key={index}
																className='text-sm text-gray-700 flex items-center'
															>
																<svg
																	className='h-4 w-4 mr-1'
																	fill='none'
																	stroke='currentColor'
																	viewBox='0 0 24 24'
																>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={2}
																		d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
																	/>
																</svg>
																{file.name}
															</li>
														))}
													</ul>
												</div>
											)}

											{hasSelectedFiles && (
												<button
													onClick={() => handleSubmit(a._id)}
													className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center'
													disabled={!isBeforeDeadline || uploading[a._id]}
												>
													{uploading[a._id] ? (
														<>
															<svg
																className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
																xmlns='http://www.w3.org/2000/svg'
																fill='none'
																viewBox='0 0 24 24'
															>
																<circle
																	className='opacity-25'
																	cx='12'
																	cy='12'
																	r='10'
																	stroke='currentColor'
																	strokeWidth='4'
																></circle>
																<path
																	className='opacity-75'
																	fill='currentColor'
																	d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
																></path>
															</svg>
															Submitting...
														</>
													) : (
														'Submit'
													)}
												</button>
											)}

											{!isBeforeDeadline && (
												<div className='text-gray-400'>
													Deadline passed. Cannot submit.
												</div>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default Deliverables;
