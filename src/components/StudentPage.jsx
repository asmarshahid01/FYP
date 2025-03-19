import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../tailwind.css';
import LeftSideBar from './LeftSideBar';
import profileImage from '../assets/profile.jpg';
import ProfileBar from './ProfileBar';
import { format } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroll-component';
import RightSideBar from './RightSideBar';

const StudentPage = () => {
	const [trigger,setTrigger]=useState(true);
	const location=useLocation();
	const { userId } = useParams();
	const token = localStorage.getItem('token');
	const bgClr = 'bg-[#f2f3f8]';
	const [requestMsg, setRequestMsg] = useState('');
	const queryParams=new URLSearchParams(location.search);
	const role=queryParams.get('role');
	const navigate=useNavigate();

	const formatDate = (timestamp) => {
		return format(new Date(timestamp), 'MMM d, yyyy hh:mm a');
	};

	const Card = ({ children, className, onClick }) => (
		<div
			className={`shadow-lg p-[1vw] bg-[#ffffff] border border-[#ffffff] ${className} rounded-sm duration-300 cursor-pointer`}
			onClick={onClick}
		>
			{children}
		</div>
	);

	const [userDetails, setUserDetails] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const initialRender = useRef(true);

	useEffect(() => {
		const fetchUserData = async () => {
			if(role==="Student"){
			try {
				const result = await axios.get(
					`http://localhost:4000/api/student/${userId}`
				);
				if (result.data) {
					console.log(result.data);
					setUserDetails(result.data.userDetails);
				}
			} catch (err) {
				console.log(err);
				setError('Failed to fetch user data');
			} finally {
				setLoading(false);
			}
		}
		else if(role==="Teacher"){
			try {
				const result = await axios.get(
					`http://localhost:4000/api/supervisor/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (result.data) {
					console.log(result.data);
					setUserDetails(result.data.userDetails);
				}
			} catch (err) {
				console.log(err);
				setError('Failed to fetch user data');
			} finally {
				setLoading(false);
			}
		}
		};
		fetchUserData();
	}, [userId]);

	// if (loading) return <p>Loading...</p>;
	// if (error) return <p>{error}</p>;

	const fetchPosts = async () => {
		if (!hasMore) return;
		try {
			const res = await axios.get(
				`http://localhost:4000/api/post/${userId}?page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(res.data);
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
		<div className='flex absolute h-full w-full top-0 left-0 bg-darkgray-100'>
			<LeftSideBar></LeftSideBar>
			<ProfileBar user={userDetails} role={role}></ProfileBar>

			{/* Main Feed */}
			<div className={`flex-1 p-[0.5vw] ml-[3.3vw] ${bgClr}`}>
				<div className='flex items-center justify-center'></div>
				<div className='overflow-y-auto h-full p-[2vw] flex flex-col items-center'>
					<div className='h-full flex flex-col w-full'>
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
									className='mb-[4vh] w-full text-[#333333] flex-1'
									//onClick={() => setRightSideBarExpand(!rightSideBarExpand)}
									onClick={() => navigate(`/profile/${post.author?._id}?role=${post.authorModel}`)}
								>
									<div className='flex items-center justify-between select-none text-[#333333]'>
										<div className='flex items-center gap-[1vw]'>
											<img
												src={post.author?.imageUrl?`http://localhost:4000${post.author.imageUrl}`:profileImage || profileImage}
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
								</Card>
							))}
						</InfiniteScroll>
					</div>
				</div>
			</div>

			<RightSideBar></RightSideBar>
		</div>
	);
};

export default StudentPage;
