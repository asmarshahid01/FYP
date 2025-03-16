import { React, useState } from 'react';
import profilePic from '../assets/profile.jpg';

export default function ProfileBar({ user }) {
	const profileId = 2;
	const members = [];
	const supervisor = '';
	const [requestMsg, setRequestMsg] = useState('');
	const totalSlots = 8;
	const availableSlots = 3;

	return (
		<div className='h-full w-1/5 z-0 bg-[#f2f3f8] absolute top-0 left-0 left-1/7 border-r-[0.1vw] border-[#D3D7EE] flex items-center justify-center p-[2vw]'>
			<div className='h-fit flex flex-col items-center justify-center gap-[2vh] min-w-full'>
				<img
					src={profilePic}
					className='relative w-[8vw] h-[8vw] rounded-full shadow-lg'
				/>
				<div className='flex flex-col items-center text-[#666666]'>
					<p className='text-[1.2vw] font-bold select-none p-0 m-0'>
						{user.name ? user.name : "N/A"}
					</p>
					<p className='text-[0.7vw] text-[#aaaaaa] select-none p-0 m-0'>
						{profileId == 1 ? 'Teacher' : profileId == 2 ? 'Student' : "N/A"}
					</p>
				</div>
				<div className='flex gap-[0.5vw] items-center mt-[1vh] self-start'>
					<p className='text-[#666666] font-bold text-[1vw]'>Email:</p>
					<a
						href={`mailto:${user.email}`}
						className='text-[#3f51b5] font-bold text-[0.9vw]'
					>
						{user.email ? user.email : "N/A"}
					</a>
				</div>
				<div className='flex flex-col gap-[0.5vw] w-full'>
					<p className='text-[#666666] font-bold text-[1vw]'>About:</p>
					<p className='text-[#888888] text-[0.9vw]'>{user.profile ? user.profile : "N/A"}</p>
				</div>
				{profileId == 2 && (
					<>
						<div className='flex flex-col gap-[0.5vw] w-full'>
							<p className='text-[#666666] font-bold text-[1vw]'>
								Group Members:
							</p>
							{members.length > 0 ? members.map((member, index) => (
								<div
									key={index}
									className='text-[#888888] text-[0.9vw] flex justify-between w-4/5'
								>
									<span>{member.name}</span>
									<span>{member.rollNo}</span>
								</div>
							)) : <p className='text-[#888888]'>No members</p>}
						</div>
						<div className='flex flex-col gap-[0.5vw] w-full'>
							<p className='text-[#666666] font-bold text-[1vw]'>Supervisor:</p>
							{supervisor ? <p className='text-[#888888] text-[0.9vw]'>{supervisor}</p> :
							<p className='text-[#888888]'>No supervisor</p>}
						</div>
					</>
				)}
				{profileId == 1 && (
					<div className='flex flex-col gap-[0.5vw] w-full'>
						<p className='text-[#666666] font-bold text-[1vw]'>No. of Slots:</p>
						<p className='text-[#888888] text-[0.9vw]'>
							{availableSlots} of {totalSlots} slots available
						</p>
					</div>
				)}
				<div className='flex flex-col gap-[0.5vw] w-full mt-[5vh]'>
					<input
						type='text'
						value={requestMsg}
						onChange={(e) => setRequestMsg(e.target.value)}
						placeholder='Request Message'
						className='text-[#888888] border border-[#cccccc] rounded-sm p-[0.5vw] text-[0.8vw] focus:outline-none'
					/>
					<div
						className='h-[2vw] w-full bg-[#3f51b5] transition hover:bg-[#4e5fbb] flex items-center justify-center font-bold
                rounded-sm cursor-pointer shadow-lg hover:shadow-[#4e5fbb] duration-500'
					>
						Request
					</div>
				</div>
			</div>
		</div>
	);
}
