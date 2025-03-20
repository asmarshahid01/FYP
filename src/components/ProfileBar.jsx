import { React, useState } from 'react';
import profilePic from '../assets/profile.jpg';
import axios from 'axios';

export default function ProfileBar({ user,role }) {
	const loggedUser=JSON.parse(localStorage.getItem("userdetails"));
	const userType=localStorage.getItem('usertype');
	const profileId = 2;
	const members = [];
	const supervisor = '';
	const [requestMsg, setRequestMsg] = useState('');
	const totalSlots = 8;
	const availableSlots = 3;

	const sendRequest = async (message, receiverId, receiverModel) => {
		try {
			const receivermodel = profileId == 1 ? 'Supervisor' : 'Student';
			const response = await axios.post(
				'http://localhost:4000/api/request',
				{
					message: requestMsg,
					receiverId: user.id,
					receiverModel: receivermodel,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust as needed
					},
				}
			);
			console.log('Request sent successfully:', response.data);
			return response.data;
		} catch (error) {
			console.error(
				'Error sending request:',
				error.response?.data?.message || error.message
			);
		}
	};

	return (
		<div className='h-full w-1/5 z-0 bg-[#f2f3f8] absolute top-0 left-0 left-1/7 border-r-[0.1vw] border-[#D3D7EE] flex items-center justify-center p-[2vw]'>
			<div className='h-fit flex flex-col items-center justify-center gap-[2vh] min-w-full'>
				<img
					src={user?.imageUrl?`http://localhost:4000${user.imageUrl}`:profilePic}
					className='relative w-[8vw] h-[8vw] rounded-full shadow-lg'
				/>
				<div className='flex flex-col items-center text-[#666666]'>
					<p className='text-[1.2vw] font-bold select-none p-0 m-0'>
						{user.name ? user.name : 'N/A'}
					</p>
					<p className='text-[0.7vw] text-[#aaaaaa] select-none p-0 m-0'>
						{role == 'Teacher' ? 'Teacher' : role == 'Student' ? 'Student' : "N/A"}
					</p>
				</div>
				<div className='flex gap-[0.5vw] items-center mt-[1vh] self-start'>
					<p className='text-[#666666] font-bold text-[1vw]'>Email:</p>
					<a
						href={`mailto:${user.email}`}
						className='text-[#3f51b5] font-bold text-[0.9vw]'
					>
						{user.email ? user.email : 'N/A'}
					</a>
				</div>
				<div className='flex flex-col gap-[0.5vw] w-full'>
					<p className='text-[#666666] font-bold text-[1vw]'>About:</p>
					<p className='text-[#888888] text-[0.9vw]'>
						{user.profile ? user.profile : 'N/A'}
					</p>
				</div>
				{role == 'Student' && (
					<>
						<div className='flex flex-col gap-[0.5vw] w-full'>
							<p className='text-[#666666] font-bold text-[1vw]'>
								Group Members:
							</p>
							{members.length > 0 ? (
								members.map((member, index) => (
									<div
										key={index}
										className='text-[#888888] text-[0.9vw] flex justify-between w-4/5'
									>
										<span>{member.name}</span>
										<span>{member.rollNo}</span>
									</div>
								))
							) : (
								<p className='text-[#888888]'>No members</p>
							)}
						</div>
						<div className='flex flex-col gap-[0.5vw] w-full'>
							<p className='text-[#666666] font-bold text-[1vw]'>Supervisor:</p>
							{supervisor ? (
								<p className='text-[#888888] text-[0.9vw]'>{supervisor}</p>
							) : (
								<p className='text-[#888888]'>No supervisor</p>
							)}
						</div>
					</>
				)}
				{role == 'Teacher' && (
					<div className='flex flex-col gap-[0.5vw] w-full'>
						<p className='text-[#666666] font-bold text-[1vw]'>No. of Slots:</p>
						<p className='text-[#888888] text-[0.9vw]'>
							{user.fypCount} of {user.fypCount} slots available
						</p>
					</div>
				)}
				{user.id!==loggedUser.id && userType!=='Teacher' && (<div className='flex flex-col gap-[0.5vw] w-full mt-[5vh]'>
					<input
						type='text'
						value={requestMsg}
						onChange={(e) => setRequestMsg(e.target.value)}
						placeholder='Request Message'
						className='text-[#888888] border border-[#cccccc] rounded-sm p-[0.5vw] text-[0.8vw] focus:outline-none'
					/>
					<button
						onClick={sendRequest}
						className='h-[2vw] w-full bg-[#3f51b5] transition hover:bg-[#4e5fbb] flex items-center justify-center font-bold
                rounded-sm cursor-pointer shadow-lg hover:shadow-[#4e5fbb] duration-500'
					>
						Request
					</button>
				</div>
			</div>
		</div>
	);
}
