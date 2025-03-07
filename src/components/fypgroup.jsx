import React, { useState } from 'react';
import profileImage from '../assets/profile.jpg';
import { Search, Pencil, ChevronDown } from 'lucide-react';
import LeftSideBar from './LeftSideBar';

const FYPGroupPage = () => {
	const [selectedRole, setSelectedRole] = useState('students');
	const [title, setTitle] = useState('Group Title');
	const [selectedCategory, setSelectedCategory] = useState('Development');
	const [isChanged, setIsChanged] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const options = ['Development', 'R&D'];

	const [pending, setPending] = useState(['Alice', 'Bob', 'Charlie']);
	const [searchQuery, setSearchQuery] = useState('');
	const [accounts] = useState([
		'John Doe',
		'Jane Smith',
		'Alice Johnson',
		'Bob Brown',
		'Charlie White',
	]);

	// Filter accounts based on search query and selected role
	const filteredAccounts = accounts.filter((account) => {
		return (
			account.toLowerCase().includes(searchQuery.toLowerCase()) &&
			(selectedRole === 'students' || selectedRole === 'teachers') &&
			searchQuery.length > 0
		);
	});

	const bgClr = 'bg-[#111820]';
	const fgClr = 'bg-[#282e3b]';
	const borderClr = 'border-[#282e3b]';
	const borderBgClr = 'border-[#111820]';

	// const bgClr = "bg-[#2b2b2b]";
	// const fgClr = "bg-[#565656]";
	// const borderClr = "border-[#565656]";

	return (
		<div className='flex absolute h-full w-full top-0 left-0 bg-darkgray-100'>
			<LeftSideBar />

			{/* Main Content */}
			<div className={`flex-1 p-6 ${bgClr} text-[#fbfbfb]`}>
				{/* Editable Title */}
				<div className='flex items-center gap-[0.8vw] border-b border-gray-500 w-full p-[1vw]'>
					{/* Edit Icon */}
					<Pencil className='h-[1.2vw] w-[1.2vw] text-gray-500 cursor-pointer' />
					{/* Editable Input */}
					<input
						type='text'
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
							setIsChanged(true);
						}}
						className='text-[2vw] font-bold bg-transparent focus:outline-none'
					/>

					{/* Save Button */}
					{isChanged && (
						<div className='bg-blue-500 pl-[1.5vw] pr-[1.5vw] pt-[0.3vw] pb-[0.3vw] select-none cursor-pointer font-bold rounded-sm ml-auto'>
							Save
						</div>
					)}
				</div>

				{/* Dropdown Menu */}
				<div className='relative inline-block text-left font-bold select-none'>
					{
						<div
							onClick={() => setIsOpen(!isOpen)}
							className={`flex items-center gap-2 ${fgClr} pl-[1.5vw] pr-[1.5vw] pt-[0.5vw] pb-[0.5vw] mt-[1vw] cursor-pointer font-bold text-white rounded-sm hover:bg-blue-400 transition`}
						>
							{selectedCategory}
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
									className='px-[1vw] py-[0.5vw] hover:bg-blue-400 cursor-pointer transition'
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
				<h2 className='text-xl font-bold mt-[5vh] mb-[1vh]'>Group Members</h2>
				<div className='space-y-[0.2vw]'>
					<div
						className={`flex items-center gap-[0.5vw] px-[0.5vw] py-[0.3vw] border ${borderClr} rounded-sm w-1/3`}
					>
						<img
							src={profileImage}
							className='w-[2.5vw] h-[2.5vw] rounded-full'
						/>
						<p className='font-bold'>{pending[0]}</p>
						<div
							className={`ml-auto ${fgClr} font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-red-400 transition`}
						>
							Remove
						</div>
					</div>
				</div>

				{/* Pending Requests */}
				<h2 className='text-xl font-bold mt-[5vh] mb-[1vh]'>
					Pending Requests
				</h2>
				<div className='overflow-x-auto'>
					{pending.length > 0 ? (
						<table className='min-w-full table-auto border-collapse select-none'>
							<thead>
								<tr className={`border-b ${borderClr}`}>
									<th className='px-[1vw] py-[0.7vw] text-left'>User</th>
									<th className='px-[1vw] py-[0.7vw] text-left'>Sent on</th>
									<th className='px-[1vw] py-[0.7vw] text-left'>Actions</th>
								</tr>
							</thead>
							<tbody>
								{pending.map((user, index) => (
									<tr key={index} className={`border-b ${borderClr}`}>
										<td className='px-[1vw] py-[0.7vw] flex items-center gap-[0.5vw] font-bold'>
											<img
												src={profileImage}
												className='w-[2.5vw] h-[2.5vw] rounded-full'
												alt='Profile'
											/>
											<p>{user}</p>
										</td>
										<td className='text-gray-500'>Feb 22, 2025</td>
										<td className='px-[1vw] py-[0.7vw]'>
											<div
												className={`inline-block ${fgClr} font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-red-400 transition`}
												onClick={() => {
													setPending((prevItems) =>
														prevItems.filter((item) => item !== user)
													);
												}}
											>
												Cancel
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className='text-gray-500'>No pending requests</p>
					)}
				</div>

				{/* Registration Deadline */}
				<h2 className='text-xl font-bold mt-[5vh]'>Registration Deadline:</h2>
				<p className='text-lg'>March 31, 2025</p>
			</div>

			{/* Right Panel */}
			<div
				className={`w-1/5 p-[1vw] ${bgClr} border-l-[0.1vw] ${borderClr} text-white`}
			>
				<div className='relative mb-[1vw]'>
					<Search className='absolute left-[0.7vw] top-[0.7vw] text-[#fbfbfb]' />
					<input
						type='text'
						placeholder='Search...'
						className={`w-full rounded-sm pl-[2.5vw] pr-[0.8vw] py-[0.5vw] ${fgClr} text-white focus:outline-none text-[0.9vw]`}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				{/* Toggle Buttons */}
				<div
					className={`flex gap-[0.5vw] mb-[3vh] select-none rounded-sm p-[0.2vw] ${fgClr}`}
				>
					<div
						onClick={() => setSelectedRole('students')}
						className={`${
							selectedRole === 'students' ? `bg-blue-400` : 'bg-transparent'
						} flex-1 text-center py-[0.5vw] rounded-sm cursor-pointer font-bold`}
					>
						Students
					</div>
					<div
						onClick={() => setSelectedRole('teachers')}
						className={`${
							selectedRole === 'teachers' ? `bg-blue-400` : 'bg-transparent'
						} flex-1 text-center py-[0.5vw] rounded-sm cursor-pointer font-bold`}
					>
						Teachers
					</div>
				</div>

				{/* Account List */}
				<div className='space-y-[0.2vw]'>
					{selectedRole == 'students' && filteredAccounts.length > 0 ? (
						filteredAccounts.map((account, index) => (
							<div
								key={index}
								className={`flex items-center gap-[0.5vw] p-[0.5vw] border ${borderClr} rounded-sm select-none hover:${fgClr} transition`}
							>
								<img
									src={profileImage}
									className='w-[2vw] h-[2vw] rounded-full'
									alt='Profile'
								/>
								<p className='font-bold'>{account}</p>
								<div
									className={`ml-auto ${fgClr} px-[1vw] py-[0.7vw] rounded-sm border ${borderBgClr} cursor-pointer ${
										!pending.includes(account) && 'hover:bg-blue-400 transition'
									}`}
									onClick={() => {
										if (!pending.includes(account)) {
											setPending((prevItems) => [...prevItems, account]);
										}
									}}
								>
									{pending.includes(account) ? 'Pending' : 'Send Request'}
								</div>
							</div>
						))
					) : (
						<p className='text-gray-500'>
							{searchQuery.length > 0 ? 'No accounts found' : ''}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default FYPGroupPage;
