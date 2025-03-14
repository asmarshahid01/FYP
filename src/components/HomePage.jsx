import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import '../tailwind.css';
import LeftSideBar from './LeftSideBar';
import profileImage from '../assets/profile.jpg';
import postImage from '../assets/post.jpg';
import ProfileBar from './ProfileBar';

const Card = ({ children, className, onClick }) => (
	<div
		className={`shadow-lg p-[1vw] bg-[#ffffff] border border-[#ffffff] ${className} rounded-sm duration-300 cursor-pointer`}
		onClick={onClick}
	>
		{children}
	</div>
);

const HomePage = () => {
	const bgClr = 'bg-[#f2f3f8]';
	const fgClr = 'bg-[#ffffff]';
	const borderClr = 'border-[#282e3b]';
	const borderBgClr = 'border-[#111820]';

	const [selectedOption, setSelectedOption] = useState('All');
	const [isOpen, setIsOpen] = useState(false);
	const [rightSideBarExpand, setRightSideBarExpand] = useState(false);
	const [requestMsg, setRequestMsg] = useState('');
	const dropdownRef = useRef(null);

	const [selectedRole, setSelectedRole] = useState('students');
	const [searchQuery, setSearchQuery] = useState('');
	const [pending, setPending] = useState([]);
	const [accounts] = useState([
		'John Doe',
		'Jane Smith',
		'Alice Johnson',
		'Bob Brown',
		'Charlie White',
	]);

	// Filter accounts based on search query and selected role
	const filteredAccounts = useMemo(() => {
		return accounts.filter((account) => {
			return (
				account.toLowerCase().includes(searchQuery.toLowerCase()) &&
				(selectedRole === 'students' || selectedRole === 'teachers') &&
				searchQuery.length > 0
			);
		});
	}, [accounts, searchQuery, selectedRole]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const [posts, setPosts] = useState([
		{
			profilePic: profileImage,
			name: 'Sir Zeeshan',
			postedDate: 3,
			postedDay: 'Monday',
			postedMonth: 2,
			postedYear: 2025,
			postedHour: 12,
			postedMin: 30,
			content: 'Hello, found this amazing',
			images: [postImage],
			request: true,
			requestSent: false,
		},
	]);

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

	return (
		<div className='flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden'>
			<LeftSideBar></LeftSideBar>

			{/* Main Feed */}
			<div className={`flex-1 p-[0.5vw] ${bgClr}`}>
				<div className='flex items-center justify-center'>
					<div
						className={`relative w-2/3 mb-[1vw] ${fgClr} text-[#333333] flex gap-[0.5vw] items-center pl-[2.5vw] pr-[0.2vw] py-[0.2vw] `}
					>
						<Search className='absolute left-[0.7vw] top-[0.7vw] text-[#333333]' />
						<input
							type='text'
							placeholder='Search...'
							className={`w-full rounded-sm focus:outline-none text-[0.9vw]`}
						/>
						<div className='relative w-[10vw]' ref={dropdownRef}>
							<div
								onClick={() => setIsOpen(!isOpen)}
								className={`flex items-center justify-between w-3/4 px-[0.8vw] py-[0.5vw] text-[#333] ${fgClr} rounded-sm
                focus:outline-none cursor-pointer ml-auto`}
							>
								{selectedOption}
								<ChevronDown
									className={`w-[0.8vw] h-[0.8vw] text-gray-600 transition-transform ${
										isOpen ? 'rotate-180' : ''
									}`}
								/>
							</div>

							{isOpen && (
								<div
									className={`absolute w-full mt-[0.5vw] bg-[#3f51b5] rounded-sm shadow-lg`}
								>
									{['All', 'Teachers', 'Students'].map((option) => (
										<div
											key={option}
											className='px-[1vw] py-[0.5vw] text-white hover:bg-[#4e5fbb] cursor-pointer'
											onClick={() => {
												setSelectedOption(option);
												setIsOpen(false);
											}}
										>
											{option}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
				<div className='overflow-y-auto h-full p-[2vw] flex flex-col items-center'>
					{posts.map((post, index) => (
						<Card
							key={index}
							className='p-[1vw] h-fit mb-[4vh] w-5/6 text-[#333333]'
							onClick={() => setRightSideBarExpand(!rightSideBarExpand)}
						>
							<div className='flex items-center justify-between select-none text-[#333333]'>
								<div className='flex items-center gap-[1vw]'>
									<img
										src={post.profilePic}
										className='w-[3vw] h-[3vw] rounded-full flex items-center justify-center font-bold'
										alt='profile'
									/>
									<div>
										<p className='font-bold'>{post.name}</p>
										<p className='text-gray-500'>
											{post.postedDay}, {months[post.postedMonth]}{' '}
											{post.postedDate} {post.postedHour}:{post.postedMin}
										</p>
									</div>
								</div>
							</div>
							<p className='mt-[0.5vw]'>{post.content}</p>
							<div className='flex gap-[0.5vw] w-full mt-[2vh]'>
								<input
									type='text'
									value={requestMsg}
									onChange={(e) => setRequestMsg(e.target.value)}
									placeholder='Request Message'
									className='text-[#888888] border border-[#cccccc] rounded-sm p-[0.5vw] text-[0.8vw] focus:outline-none flex-[8]'
								/>
								<div
									className='h-[2.5vw] w-full bg-[#3f51b5] transition hover:bg-[#4e5fbb] flex items-center justify-center font-bold
                                rounded-sm cursor-pointer shadow-lg hover:shadow-[#4e5fbb] duration-500 text-[#eeeeee] flex-[2]'
								>
									Request
								</div>
							</div>
							{/* <div className="mt-[0.5vw] flex">
                  <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className={`w-full rounded-sm px-[0.8vw] py-[0.5vw] bg-[#ffffff] text-[#333333] focus:outline-none text-[0.9vw]`}
                />
                <p className={`${post.request && !post.requestSent ? "bg-[#3f51b5]" : "bg-[#355c7d]"} text-[#eeeeee] w-[8vw] px-[1vw] py-[0.5vw] rounded-sm
                ${post.request && !post.requestSent && "cursor-pointer"} ${post.request && !post.requestSent ? "hover:bg-[#4e5fbb]" : "bg-[#355c7d"} duration-300
                flex items-center justify-center select-none`}
                onClick={()=>{
                  if(post.request && !post.requestSent) {
                    setPosts((prevPosts) =>
                      prevPosts.map((post, idx) =>
                        idx === index ? { ...post, requestSent: true } : post
                      )
                    );
                  } else if(post.request && post.requestSent) {
                    setPosts((prevPosts) =>
                      prevPosts.map((post, idx) =>
                        idx === index ? { ...post, requestSent: false } : post
                      )
                    );
                  }
                }}>{post.requestSent ? "Cancel" : "Send Request"}</p>
              </div> */}
						</Card>
					))}
				</div>
			</div>

			{/* Right Panel */}
			<div
				className={`w-1/5 p-[1vw] ${bgClr} border-l-[0.1vw] border-[#D3D7EE] text-white`}
			>
				<div className='relative mb-[1vw] bg-[#ffffff] text-[#333333]'>
					<Search className='absolute left-[0.7vw] top-[0.7vw] text-[#333333]' />
					<input
						type='text'
						placeholder='Search...'
						className={`w-full rounded-sm pl-[2.5vw] pr-[0.8vw] py-[0.5vw] focus:outline-none text-[0.9vw]`}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				{/* Toggle Buttons */}
				<div
					className={`flex gap-[0.5vw] mb-[3vh] select-none rounded-sm p-[0.2vw] bg-[#3f51b5] shadow-lg`}
				>
					<div
						onClick={() => setSelectedRole('students')}
						className={`${
							selectedRole === 'students' ? `bg-[#4e5fbb]` : 'bg-transparent'
						} flex-1 text-center py-[0.5vw] rounded-sm cursor-pointer font-bold`}
					>
						Students
					</div>
					<div
						onClick={() => setSelectedRole('teachers')}
						className={`${
							selectedRole === 'teachers' ? `bg-[#4e5fbb]` : 'bg-transparent'
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
								className={`flex items-center gap-[0.5vw] p-[0.5vw] shadow-lg rounded-sm select-none bg-[#3f51b5] transition`}
							>
								<img
									src={profileImage}
									className='w-[2.5vw] h-[2.5vw] rounded-full'
									alt='Profile'
								/>
								<p className='font-bold'>{account}</p>
								<div
									className={`ml-auto px-[1vw] py-[0.7vw] rounded-sm ${
										pending.includes(account) ? 'bg-[#f4516c]' : 'bg-[#4e5fbb]'
									} transition ${
										pending.includes(account) && 'hover:bg-[#F33F5D]'
									} cursor-pointer`}
									onClick={() => {
										if (!pending.includes(account))
											setPending((prevItems) => [...prevItems, account]);
										else
											setPending((prevItems) =>
												prevItems.filter((item) => item !== account)
											);
									}}
								>
									{pending.includes(account) ? 'Cancel' : 'Send Request'}
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

export default HomePage;
