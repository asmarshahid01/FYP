import { React, useState, useRef, useEffect } from 'react';
import profileImage from '../assets/profile.jpg';
import { useNavigate } from 'react-router-dom';
import {
	Home,
	Mail,
	Users,
	FileText,
	LogOut,
	ChevronRight,
	ChevronLeft,
} from 'lucide-react';
import axios from 'axios';

const LeftSideBar = () => {
	const bgClr = 'bg-[#2a363b]';
	const fgClr = 'bg-[#292b3a]';
	const borderClr = 'border-[#282e3b]';
	const borderBgClr = 'border-[#111820]';

	const navigate = useNavigate();
	const [name,setName]=useState('');
	const [email,setEmail]=useState('');
	const [bio, setBio] = useState('');
	const [userInfoChanged, setUserInfoChanged] = useState(false);
	const [userProfileExpand, setUserProfileExpand] = useState(false);
	const [selectedMenu, setSelectedMenu] = useState(1);

	const fileInputRef = useRef(null);
	const [tempProfilePic, setTempProfilePic] = useState(profileImage);
	const [profilePic, setProfilePic] = useState(profileImage);


	const handleBioChange=async(e)=>{
		try {
			const token=localStorage.getItem("token");
			const updateBio=await axios.put("http://localhost:4000/api/student/updateBio",{bio},{
				headers:{
					Authorization:`Bearer ${token}`
				}
			});
			if(updateBio.status===200){
				setBio(updateBio.data.bio)
			}
		} catch (error) {
			console.error("Something Went Wrong "+error);
		}
	}

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setTempProfilePic(URL.createObjectURL(file));
		}
		setUserInfoChanged(true);
	};

	useEffect(()=>{
		async function getDetails(){

			try {
				const token=localStorage.getItem("token");
			if(!token){
				console.error("No Token Found, User is not authenticated");
				return;
			}
			const result=await axios.get("http://localhost:4000/api/student/info",{
				headers:{
					Authorization:`Bearer ${token}`
				}
			});
			if(result.data){
				console.log(result)
				const userDetails=result.data?.userDetails;
				setName(userDetails.name||"");
				setEmail(userDetails.email||"");
				setBio(userDetails.profile||"");
			}
				
			} catch (error) {
				console.error("Error found ",error)
			}
		};
		getDetails();
	},[])

	return (
		<>
			<div
				className={`w-1/7 h-full ${bgClr} shadow-md flex flex-col items-center gap-[5vh] border-r-[0.1vw] ${borderClr} relative`}>
				{/* Profile Section (Absolute Positioning) */}
				<div className='w-full p-[0.5vw] absolute top-0 left-0'>
					<div
						className={`flex flex-col items-start w-full border border-[#555555] "bg-[#2a363b]" shadow-lg rounded-sm
        					p-[0.5vw] cursor-pointer hover:border-[#f7c402] duration-500 transition-all ease-in-out overflow-hidden "h-[7vh]"`}
						onClick={() => setUserProfileExpand(!userProfileExpand)}
					>
						<div className='flex justify-between w-full'>
							{/* User Info */}
							<div className='flex items-center w-full gap-[0.5vw]'>
								<img
									src={profilePic}
									className='w-[2vw] h-[2vw] rounded-full'
								/>
								<div className='flex flex-col'>
									<p className='text-[1vw] font-bold select-none p-0 m-0'>
										{name}
									</p>
									<p className='text-[0.7vw] text-[#aaaaaa] select-none p-0 m-0'>
										Student
									</p>
								</div>
							</div>
							{/* Toggle Button */}
							<div className='h-[5vh] flex items-center'>
								{userProfileExpand ? <ChevronLeft /> : <ChevronRight />}
							</div>
						</div>
					</div>
				</div>

				<nav className='w-full select-none pt-[35vh]'>
					<div
						className={`px-[1vw] py-[1vw] ${
							selectedMenu == 1 ? fgClr : bgClr
						} ${selectedMenu == 1 && 'border-l-[0.2vw] border-l-[#ffffff]'} 
      cursor-pointer hover:text-[#f7c402] border border-transparent hover:border-t-[#f7c402] hover:border-b-[#f7c402] 
      duration-300 font-bold flex gap-[0.5vw]`}
						onClick={() => {
							setSelectedMenu(1);
							navigate('/home');
						}}
					>
						<Home /> Dashboard
					</div>
					<div
						className={`px-[1vw] py-[1vw] ${
							selectedMenu == 2 ? fgClr : bgClr
						} ${selectedMenu == 2 && 'border-l-[0.2vw] border-l-[#ffffff]'} 
      cursor-pointer hover:text-[#f7c402] border border-transparent hover:border-t-[#f7c402] hover:border-b-[#f7c402] 
      duration-300 font-bold flex gap-[0.5vw]`}
						onClick={() => {
							setSelectedMenu(2);
							navigate('/inbox');
						}}
					>
						<Mail /> Inbox
					</div>
					<div
						className={`px-[1vw] py-[1vw] ${
							selectedMenu == 3 ? fgClr : bgClr
						} ${selectedMenu == 3 && 'border-l-[0.2vw] border-l-[#ffffff]'} 
      cursor-pointer hover:text-[#f7c402] border border-transparent hover:border-t-[#f7c402] hover:border-b-[#f7c402] 
      duration-300 font-bold flex gap-[0.5vw]`}
						onClick={() => {
							setSelectedMenu(3);
							navigate('/group');
						}}
					>
						<Users /> FYP Group
					</div>
					<div
						className={`px-[1vw] py-[1vw] ${
							selectedMenu == 4 ? fgClr : bgClr
						} ${selectedMenu == 4 && 'border-l-[0.2vw] border-l-[#ffffff]'} 
      cursor-pointer hover:text-[#f7c402] border border-transparent hover:border-t-[#f7c402] hover:border-b-[#f7c402] 
      duration-300 font-bold flex gap-[0.5vw]`}
						onClick={() => setSelectedMenu(4)}
					>
						<FileText /> Deliverables
					</div>
				</nav>

				{/* Logout Button at Bottom */}
				<button
					onClick={() => {
						localStorage.removeItem('token');
						navigate('/');
					}}
					className={`mt-auto ${fgClr} px-[1vw] py-[1vw] border-l-[0.2vw] border-l-[#f4516c] hover:text-[#f4516c] cursor-pointer hover:border-t-[#f4516c] hover:border-b-[#f4516c] border border-transparent duration-300 w-full font-bold select-none flex gap-[0.5vw]`}
				>
					<LogOut /> Logout
				</button>
			</div>

			<div className='h-full w-1/6 bg-transparent pointer-events-none z-10 relative'>
				<div
					className={`absolute top-0 left-0 h-full bg-[#292b3a] transition-all duration-500 ${
						userProfileExpand ? 'w-full pointer-events-auto' : 'w-0'
					}
    flex items-center justify-center`}
				>
					<div
						className={`h-full transition-all duration-500 ${
							userProfileExpand ? 'min-w-full max-w-full' : 'min-w-0 max-w-0'
						} 
      ${
				userProfileExpand ? 'opacity-100' : 'opacity-0'
			} relative overflow-hidden flex-shrink-0 flex flex-col items-center justify-center`}
					>
						<div className='relative w-[8vw] h-[8vw]'>
							<input
								type='file'
								accept='image/*'
								ref={fileInputRef}
								className='hidden'
								onChange={handleImageChange}
							/>

							<img
								src={tempProfilePic}
								className='w-full h-full rounded-full cursor-pointer'
								onClick={() => fileInputRef.current.click()}
							/>

							<div
								className='absolute top-0 left-0 w-full h-full rounded-full bg-black transition-all duration-500 opacity-10 hover:opacity-30 cursor-pointer'
								onClick={() => fileInputRef.current.click()}
							></div>
						</div>
						<div className='flex flex-col items-center mt-[0.6vw]'>
							<p className='text-[1vw] font-bold select-none p-0 m-0'>
								{name}
							</p>
							<p className='text-[0.7vw] text-[#aaaaaa] select-none p-0 m-0'>
								Student
							</p>
						</div>
						<div className='w-full px-[1vw] flex flex-col gap-[1vh] items-center mt-[1vw]'>
							<textarea
								value={bio}
								placeholder='Add your interests... e.g. AI/ML, Web, App, etc.'
								onChange={(e) => {
									setBio(e.target.value);
									setUserInfoChanged(true);
								}}
								className={`transition-all duration-500 ease-in-out text-[0.8vw] bg-transparent rounded-sm focus:outline-none border border-[0.1vw] border-[#2a363b] 
            focus:border-[#36a3f7] w-full p-[0.2vw] resize-none ${
							userProfileExpand
								? 'opacity-100 max-h-[15vh] mt-[0.5vw]'
								: 'opacity-0 max-h-0 mt-0'
						}`}
								rows={5}
								spellCheck={false}
								maxLength={100}
							/>
							<div
								className={`w-full flex items-center justify-center select-none h-[5vh] border-[0.1vw] border-[#36a3f7] rounded-sm ${
									userInfoChanged && 'cursor-pointer'
								}
            ${userInfoChanged ? 'bg-[#36a3f7]' : 'bg-[#89c9fb]'} ${
									userInfoChanged && 'hover:bg-[#1494f5]'
								} duration-300 font-bold`}
								onClick={() => {
									handleBioChange();
									setUserInfoChanged(false);
									setProfilePic(tempProfilePic);
								}}
							>
								Save		
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LeftSideBar;
