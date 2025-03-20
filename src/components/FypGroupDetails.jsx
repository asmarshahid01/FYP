import React, { useState, useEffect } from 'react';
import profileImage from '../assets/profile.jpg';
import { Pencil, ChevronDown } from 'lucide-react';
import LeftSideBar from './LeftSideBar';
import { Search } from 'lucide-react';
import axios from 'axios';

const FypGroupDetails = () => {
	const [receivedRequests, setReceivedRequests] = useState([]);

	const [groupDetails, setGroupDetails] = useState([
		{
			members: [
				{ name: 'Abdul Wahaab', rollNo: '21L-5291' },
				{ name: 'Saad Sohail', rollNo: '21L-5344' },
				{ name: 'Asmar Shahid', rollNo: '21L-1754' },
			],
			projectType: 'Development',
			projectSummary:
				'An online portal to manage all FYP related stuff, for students as well as supervisors and co-ordinators',
		},
	]);

	const bgClr = 'bg-[#f2f3f8]';
	const fgClr = 'bg-[#3f51b5]';

	// const bgClr = "bg-[#2b2b2b]";
	// const fgClr = "bg-[#565656]";
	// const borderClr = "border-[#565656]";

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	useEffect(() => {
		async function fetchData() {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:4000/api/request', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log('Received requests:', response.data);
				setReceivedRequests(response.data.requests);
			} catch (error) {
				console.error(
					'Error fetching received requests:',
					error.response?.data?.message || error.message
				);
			}
		}
		fetchData();
	}, []);

	return (
		<div className='flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden'>
			<LeftSideBar />

			{/* Main Content */}
			<div
				className={`flex-1 py-[1vw] pl-[1vw] pr-[5vw] ${bgClr} text-[#333333] overflow-auto`}
			>
				<div
					className={`relative w-3/4 shadow-lg mb-[1vw] bg-[#ffffff] text-[#333333] flex gap-[0.5vw] rounded-sm items-center pl-[2.5vw] pr-[0.2vw] py-[0.5vw] `}
				>
					<Search className='absolute left-[0.7vw] top-[0.7vw] text-[#333333]' />
					<input
						type='text'
						placeholder='Search groups'
						className={`w-full rounded-sm focus:outline-none text-[0.9vw]`}
					/>
				</div>

				{/* Received Requests */}
				<h2 className='text-[1.5vw] font-bold mt-[5vh] mb-[1vh] text-[#4e5fbb]'>
					Received Requests
				</h2>
				<div className='overflow-x-auto w-3/4'>
					<table className='min-w-full table-auto border-collapse select-none rounded-sm shadow-lg'>
						<thead>
							<tr className={`bg-[#3f51b5] text-white`}>
								<th className='px-[1vw] py-[0.7vw] text-left'>User</th>
								<th className='px-[1vw] py-[0.7vw] text-left'>Received on</th>
								<th className='px-[1vw] py-[0.7vw] text-left'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{receivedRequests.length > 0 ? (
								receivedRequests.map((request, index) => (
									<tr
										key={index}
										className={index % 2 == 0 ? 'bg-[#ffffff]' : 'bg-[#f7f7f7]'}
									>
										<td className='pl-[1vw] py-[0.7vw] flex items-center gap-[0.5vw] font-bold max-w-fit'>
											<img
												src={'../../Backend/' + request.sender.imageUrl}
												className='w-[2.5vw] h-[2.5vw] rounded-full'
												alt='Profile'
											/>
											<div className='max-w-fit'>
												<p className='text-[#4e5fbb]'>{request.sender.name}</p>
												<p className='font-normal opacity-50 max-w-[50ch]'>
													{request.message}
												</p>
											</div>
										</td>
										<td className='text-[#99A1D6]'></td>
										<td className='px-[1vw] py-[0.7vw]'>
											<div
												className={`inline-block bg-[#3f51b5] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#4e5fbb] text-white transition`}
												onClick={() => {
													setReceivedRequests((prevItems) =>
														prevItems.filter((item) => item !== user)
													);
												}}
											>
												Accept
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colspan={3} className='w-full text-center'>
										<p className='opacity-50 mt-[2vh]'>No pending requests</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Groups */}
				<h2 className='text-[1.5vw] font-bold mt-[5vh] mb-[1vh] text-[#4e5fbb]'>
					Groups
				</h2>
				<div className='overflow-x-auto w-3/4'>
					{groupDetails.length > 0 &&
						groupDetails.map((grp, index) => (
							<div key={index}>
								<div className='flex justify-between gap-[1vw]'>
									<div>
										<p className=' text-[#777777] text-[0.8vw]'>
											<span className='font-bold text-[#3f51b5]'>
												Project Type:{' '}
											</span>
											{grp.projectType}
										</p>
										<p className=' text-[#777777] text-[0.8vw]'>
											<span className='font-bold text-[#3f51b5]'>
												Project Summary:{' '}
											</span>
											{grp.projectSummary}
										</p>
									</div>
									<div
										className={`inline-block bg-[#3f51b5] max-h-[2.5vw] flex items-center justify-center font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#4e5fbb] text-white transition`}
									>
										Message
									</div>
								</div>
								<table className='min-w-full table-auto border-collapse select-none rounded-sm shadow-lg mt-[1vh]'>
									<thead>
										<tr className={`bg-[#3f51b5] text-white`}>
											<th className='px-[1vw] py-[0.7vw] text-left'>Student</th>
											<th className='px-[1vw] py-[0.7vw] text-left'>Roll No</th>
											<th className='px-[1vw] py-[0.7vw] text-left'>Email</th>
										</tr>
									</thead>
									<tbody>
										{grp.members.map((member, grpIndex) => (
											<tr
												key={grpIndex}
												className={
													grpIndex % 2 == 0 ? 'bg-[#ffffff]' : 'bg-[#f7f7f7]'
												}
											>
												<td className='px-[1vw] py-[0.7vw] flex items-center gap-[0.5vw] font-bold'>
													<img
														src={profileImage}
														className='w-[2.5vw] h-[2.5vw] rounded-full'
														alt='Profile'
													/>
													<p className='text-[#4e5fbb]'>{member.name}</p>
												</td>
												<td className='text-[#3f51b5] pl-[0.4vw] px-[1vw] py-[0.7vw] font-bold'>
													{member.rollNo}
												</td>
												<td className='text-[#3f51b5] pl-[0.4vw] px-[1vw] py-[0.7vw] font-bold'>
													<a
														href={`mailto:${
															member.rollNo.charAt(2).toLowerCase() +
															member.rollNo.substring(0, 2) +
															member.rollNo.substring(4, 8) +
															'@lhr.nu.edu.pk'
														}`}
													>
														{member.rollNo.charAt(2).toLowerCase()}
														{member.rollNo.substring(0, 2)}
														{member.rollNo.substring(4, 8)}@lhr.nu.edu.pk
													</a>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						))}
				</div>

				{/* Registration Deadline */}
				<h2 className='text-xl font-bold mt-[5vh] text-[#4e5fbb]'>
					Registration Deadline:
				</h2>
				<p className='text-lg text-[#4e5fbb]'>March 31, 2025</p>
			</div>
		</div>
	);
};

export default FypGroupDetails;
