import React, {
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronDown } from 'lucide-react';
import '../tailwind.css';
import LeftSideBar from './LeftSideBar';
import profileImage from '../assets/profile.jpg';
import ProfileBar from './ProfileBar';
import { format } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';
import RightSideBar from './RightSideBar';

const Card = ({ children, className, onClick }) => (
	<div
		className={`shadow-lg p-[1vw] bg-[#ffffff] border border-[#ffffff] ${className} rounded-sm duration-300 cursor-pointer`}
		onClick={onClick}
	>
		{children}
	</div>
);

const SupervisorHomePage = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');
	const bgClr = 'bg-[#f2f3f8]';
	const fgClr = 'bg-[#ffffff]';

	const [selectedOption, setSelectedOption] = useState('All');
	const [isOpen, setIsOpen] = useState(false);
	const [requestMsg, setRequestMsg] = useState('');
	const dropdownRef = useRef(null);

	const [pending, setPending] = useState([]);
	const [accounts] = useState([
		'John Doe',
		'Jane Smith',
		'Alice Johnson',
		'Bob Brown',
		'Charlie White',
	]);

	const [content, setContent] = useState('');

	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const initialRender = useRef(true);

	const handleCreatePost = async () => {
		if (!content.trim()) return alert('Post content cannot be empty.');

		try {
			const response = await axios.post(
				'http://localhost:4000/api/post',
				{
					authorModel:
						localStorage.getItem('usertype') === 'Teacher'
							? 'Supervisor'
							: localStorage.getItem('usertype'),
					content,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setContent('');
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	// Filter accounts based on search query and selected role
	// const filteredAccounts = useMemo(() => {
	// 	return accounts.filter((account) => {
	// 		return (
	// 			account.toLowerCase().includes(searchQuery.toLowerCase()) &&
	// 			(selectedRole === 'students' || selectedRole === 'teachers') &&
	// 			searchQuery.length > 0
	// 		);
	// 	});
	// }, [accounts, searchQuery, selectedRole]);

	const formatDate = (timestamp) => {
		return format(new Date(timestamp), 'MMM d, yyyy hh:mm a');
	};

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

	const fetchPosts = async () => {
		if (!hasMore) return;
		try {
			const res = await axios.get(
				`http://localhost:4000/api/post?page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const newPosts = res.data;
			if (newPosts.length === 0) {
				setHasMore(false);
			} else {
				setPosts((prevPosts) => [...prevPosts, ...newPosts]);
				setPage((prevPage) => prevPage + 1);
			}
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	};

	useEffect(() => {
		if (initialRender.current) {
			fetchPosts();
			initialRender.current = false;
		}
	}, []);

	return (
		<div className='flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden'>
			<LeftSideBar></LeftSideBar>

			{/* Main Feed */}
			<div
				className={`flex-1 py-[0.5vw] px-[5vw] ${bgClr} overflow-auto flex-col items-center`}
			>
				<div className='flex items-center justify-center'>
					<div
						className={`relative w-full shadow-lg mb-[1vw] ${fgClr} text-[#333333] flex gap-[0.5vw] items-center pl-[2.5vw] pr-[0.2vw] py-[0.2vw] `}
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
				<div className='w-full flex flex-col items-start gap-[1vh]'>
					<textarea
						className='text-[#333333] shadow-lg rounded-sm p-[0.8vw] text-[0.8vw] focus:outline-none bg-white resize-none overflow-auto w-full'
						placeholder='Write a post...'
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows={3}
					/>
					<div
						className='py-[0.6vw] px-[1vw] bg-[#3f51b5] transition hover:bg-[#4e5fbb] flex items-center justify-center font-bold
						rounded-sm cursor-pointer shadow-lg hover:shadow-[#4e5fbb] duration-500 text-[#eeeeee] flex-[2] mb-[2vw]'
						onClick={handleCreatePost}
					>
						Create Post
					</div>
				</div>
				<div className='h-fit flex flex-col pb-[2vw]'>
					<InfiniteScroll
						dataLength={posts.length}
						next={fetchPosts}
						hasMore={hasMore}
						loader={
							<div className='flex items-center justify-center text-[#333333]'>
								<p className='text-[#aaaaaa]'>Loading...</p>
							</div>
						}
						endMessage={<p style={{ textAlign: 'center' }}>No more posts</p>}
					>
						{posts.map((post) => (
							<Card
								key={post._id}
								className='mb-[4vh] w-full text-[#333333] flex-1 shadow-lg'
								//onClick={() => setRightSideBarExpand(!rightSideBarExpand)}
								onClick={() =>
									navigate(
										`/profile/${post.author?._id}?role=${
											post.authorModel === 'Supervisor'
												? 'Teacher'
												: post.authorModel
										}`
									)
								}
							>
								<div className='flex items-center justify-between select-none text-[#333333]'>
									<div className='flex items-center gap-[1vw]'>
										<img
											src={
												post.author?.imageUrl
													? `http://localhost:4000${post.author.imageUrl}`
													: profileImage || profileImage
											}
											className='w-[3vw] h-[3vw] rounded-full flex items-center justify-center font-bold'
											alt='profile'
										/>
										<div>
											<p className='font-bold'>{post.author?.name}</p>
											<p className='text-gray-500'>
												{formatDate(post.createdAt)}
											</p>
										</div>
									</div>
								</div>
								<p className='mt-[0.5vw]'>{post.content}</p>
							</Card>
						))}
					</InfiniteScroll>
				</div>
			</div>

			<div
				className={`w-1/5 p-[1vw] ${bgClr} border-l-[0.1vw] border-[#D3D7EE] text-white`}
			></div>
		</div>
	);
};

export default SupervisorHomePage;
