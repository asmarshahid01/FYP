import React, { useEffect, useState } from 'react';
import profileImage from '../assets/profile.jpg';
import { Pencil, ChevronDown } from 'lucide-react';
import LeftSideBar from './LeftSideBar';
import axios from 'axios';
import { use } from 'react';
import { toast } from 'react-toastify';

const FYPGroupPage = () => {
	const [title, setTitle] = useState('');
	const [selectedCategory, setSelectedCategory] = useState();
	const [isChanged, setIsChanged] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const options = ['Development', 'R&D'];
	console.log(JSON.parse(localStorage.getItem('userdetails')));
	const userid = JSON.parse(localStorage.getItem('userdetails')).id;

	const [pending, setPending] = useState([]);
	const [groupMembers, setGroupMembers] = useState([]);
	const [group, setGroup] = useState('');
	const [groupTitle, setGroupTitle] = useState('');
	const [groupType, setGroupType] = useState();
	const [receivedRequests, setReceivedRequests] = useState([]);
	const [admin, setAdmin] = useState('');
	const [adminCheck,setAdminCheck]=useState(false);

	const bgClr = 'bg-[#f2f3f8]';
	const fgClr = 'bg-[#3f51b5]';

	// const bgClr = "bg-[#2b2b2b]";
	// const fgClr = "bg-[#565656]";
	// const borderClr = "border-[#565656]";

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

	useEffect(() => {
		async function fetchData() {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(
					'http://localhost:4000/api/request/pending',
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				console.log('Pending requests:', response.data);
				setPending(response.data.requests);
			} catch (error) {
				console.error(
					'Error fetching pending requests:',
					error.response?.data?.message || error.message
				);
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		async function fetchData() {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:4000/api/group', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log("Here")
				console.log(response.data);
				setGroupMembers(response.data.group.studentsId);
				setGroup(response.data.group._id);
				setGroupTitle(response.data.group.title);
				setGroupType(response.data.group.type);
				const admin = response.data.group.studentsId.find(
					(student) => student.role == true
				);
				if (admin) {
					setAdmin(admin._id);
				}
			} catch (error) {
				console.error(
					'Error fetching group members:',
					error.response?.data?.message || error.message
				);
			}
		}
		fetchData();
	}, []);

	const deleteRequest = async (id) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.delete(
				`http://localhost:4000/api/request/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('Request deleted successfully:', response.data);
		} catch (error) {
			console.error(
				'Error deleting request:',
				error.response?.data?.message || error.message
			);
		}
	};

	const acceptRequest = async (id) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.post(
				`http://localhost:4000/api/request/${id}/accept`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('Request accepted successfully:', response.data);
		} catch (error) {
			console.error(
				'Error accepting request:',
				error.response?.data?.message || error.message
			);
		}
	};

	const makeAdmin=async(id)=>{
		const token = localStorage.getItem('token');
		try {
			const response=await axios.put(`http://localhost:4000/api/group/assignAdmin/${id}`,
				{
					adminId:admin
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if(response.status===200){
				toast.success("Role Changed Successfully!");
				setTimeout(()=>{
					window.location.reload();
				},2000);
			}

			
		} catch (error) {
			toast.error("Something Went Wrong!");
			console.log(error);
		}

	}

	const updateGroup = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.put(
				`http://localhost:4000/api/group/${group}`,
				{
					title,
					type: selectedCategory,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('Group updated successfully:', response.data);
			window.location.reload();
		} catch (error) {
			console.error(
				'Error updating group:',
				error.response?.data?.message || error.message
			);
		}
	};

	const leaveGroup = async () => {
		if(adminCheck){
			try {
				const token = localStorage.getItem('token');
				const response = await axios.post(
					'http://localhost:4000/api/group/leave',
					null,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				console.log('Group left successfully:', response.data);
				window.location.reload();
			} catch (error) {
				console.log(error);
			}
		}
		else{
			toast.error("Alot Admin Role before leaving");
		}
	};

	return (
		<div className='flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden'>
			<LeftSideBar />

			{/* Main Content */}
			<div
				className={`flex-1 py-[1vw] pl-[1vw] pr-[5vw] ${bgClr} text-[#333333] overflow-auto`}
			>
				{/* Editable Title */}
				<div className='flex items-center gap-[0.8vw] border-b border-[#D3D7EE] w-full p-[1vw]'>
					{/* Edit Icon */}
					<Pencil className='h-[1.2vw] w-[1.2vw] text-gray-500 cursor-pointer' />
					{/* Editable Input */}
					<input
						type='text'
						value={groupTitle}
						placeholder='Group Title'
						onChange={(e) => {
							setTitle(e.target.value);
							setIsChanged(true);
						}}
						className='text-[2vw] font-bold bg-transparent focus:outline-none text-[#4e5fbb]'
					/>

					{/* Save Button */}
					{
						<button
							onClick={updateGroup}
							className='bg-[#3f51b5] hover-bg-[#4e5fbb] duration-300 text-white pl-[1.5vw] pr-[1.5vw] pt-[0.3vw] pb-[0.3vw] select-none cursor-pointer font-bold rounded-sm ml-auto'
						>
							Save
						</button>
					}
				</div>

				{/* Dropdown Menu */}
				<div className='relative inline-block text-left font-bold select-none'>
					{
						<div
							onClick={() => setIsOpen(!isOpen)}
							className={`flex items-center gap-2 ${fgClr} pl-[1.5vw] pr-[1.5vw] pt-[0.5vw] pb-[0.5vw] mt-[1vw] cursor-pointer font-bold text-white rounded-sm hover:bg-[#4e5fbb] transition`}
						>
							{selectedCategory ?? groupType ?? 'Development'}
							<ChevronDown className='h-[0.7vw] w-[0.7vw]' />
						</div>
					}

					{/* Dropdown Menu */}
					{isOpen && (
						<div
							className={`absolute mt-[0.5vw] w-[8vw] ${fgClr} text-white rounded-sm shadow-lg shadow-gray-900`}
						>
							{options.map((option, index) => (
								<div
									key={index}
									className='px-[1vw] py-[0.5vw] hover:bg-[#4e5fbb] cursor-pointer transition'
									onClick={() => {
										setSelectedCategory(option);
										setIsOpen(false);
									}}
								>
									{option}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Group members */}
				<h2 className='text-xl font-bold mt-[5vh] mb-[1vh] text-[#4e5fbb]'>
					Group Members
				</h2>
				<div className='flex flex-col gap-[0.5vh]'>
					{groupMembers.length > 0 ? (
						groupMembers.map((member, index) => (
							<div key={index} className='space-y-[0.2vw]'>
								<div
									className={`flex items-center gap-[0.5vw] px-[0.5vw] py-[0.5vw] shadow-lg rounded-sm w-1/3 bg-[#3f51b5] text-white`}
								>
									<img
										src={'../../Backend/' + member.imageUrl}
										className='w-[2.5vw] h-[2.5vw] rounded-full'
									/>
									{member.role == 1 ? (
										<div className='flex flex-col'>
											<p className='font-bold'>{member.name}</p>
											<p className='opacity-50'>Admin</p>
										</div>
									) : (
										<p className='font-bold'>{member.name}</p>
									)}
									{member._id == userid ? (
										<button
											className={`ml-auto bg-[#f4516c] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#F33F5D] transition`}
											onClick={leaveGroup}
										>
											Leave
										</button>
									) : (
										userid == admin && (
											<>
											<button
												className={`ml-auto bg-[#f4516c] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#F33F5D] transition`}
												onClick={() =>
													setGroupMembers((prevItems) =>
														prevItems.filter((item) => item !== member)
													)
												}
											>
												Remove
											</button>
											<button
												className={`ml-auto bg-[#007c3d] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#02bc5e] transition`}
												onClick={()=>{
													makeAdmin(member._id,admin);
												}
												}
											>
												Make Admin
											</button>
											</>
										)
									)}
								</div>
							</div>
						))
					) : (
						<p className='opacity-50'>No Group Members</p>
					)}
				</div>

				{/* Received Requests */}
				<h2 className='text-xl font-bold mt-[5vh] mb-[1vh] text-[#4e5fbb]'>
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
										<td className='text-[#99A1D6]'>
											{/* idhr date daalni hai */}
										</td>
										<td className='px-[1vw] py-[0.7vw]'>
											<button
												className={`inline-block bg-[#3f51b5] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#4e5fbb] text-white transition`}
												onClick={() => {
													acceptRequest(request._id);
												}}
											>
												Accept
											</button>
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

				{/* Sent Requests */}
				<h2 className='text-xl font-bold mt-[5vh] mb-[1vh] text-[#4e5fbb]'>
					Sent Requests
				</h2>
				<div className='overflow-x-auto w-3/4'>
					<table className='min-w-full table-auto border-collapse select-none rounded-sm shadow-lg'>
						<thead>
							<tr className={`bg-[#3f51b5] text-white`}>
								<th className='px-[1vw] py-[0.7vw] text-left'>User</th>
								<th className='px-[1vw] py-[0.7vw] text-left'>Sent on</th>
								<th className='px-[1vw] py-[0.7vw] text-left'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{pending.length > 0 ? (
								pending.map((request, index) => (
									<tr
										key={request._id}
										className={index % 2 == 0 ? 'bg-[#ffffff]' : 'bg-[#f7f7f7]'}
									>
										<td className='px-[1vw] py-[0.7vw] flex items-center gap-[0.5vw] font-bold'>
											<img
												src={'../../Backend/' + request.receiver.imageUrl}
												className='w-[2.5vw] h-[2.5vw] rounded-full'
												alt='Profile'
											/>
											<div>
												<p className='text-[#4e5fbb]'>
													{request.receiver.name}
												</p>
												<p className='font-normal opacity-50 truncate w-[25ch]'>
													{request.message}
												</p>
											</div>
										</td>
										<td className='text-[#99A1D6] pl-[0.4vw]'>Feb 22, 2025</td>
										<td className='px-[1vw] py-[0.7vw]'>
											<div
												className={`inline-block bg-[#f4516c] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#F33F5D] text-white transition`}
												onClick={() => {
													deleteRequest(request._id);
												}}
											>
												Cancel
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

				{/* Registration Deadline */}
				<h2 className='text-xl font-bold mt-[5vh] text-[#4e5fbb]'>
					Registration Deadline:
				</h2>
				<p className='text-lg text-[#4e5fbb]'>March 31, 2025</p>
			</div>
		</div>
	);
};

export default FYPGroupPage;
