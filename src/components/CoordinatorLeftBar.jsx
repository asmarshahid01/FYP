import { React, useState } from 'react';
import {
	Megaphone,
	MessageCircle,
	FileText,
	CheckCircle,
	LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoordinatorLeftBar = () => {
	const bgClr = 'bg-[#2a363b]';
	const fgClr = 'bg-[#292b3a]';
	const borderClr = 'border-[#282e3b]';

	const navigate = useNavigate();
	const [selectedMenu, setSelectedMenu] = useState(1);

	return (
		<div
			className={`min-w-[180px] max-w-[220px] w-1/7 h-full ${bgClr} shadow-md flex flex-col items-center gap-[2vh] border-r-[0.1vw] ${borderClr} relative`}
		>
			<nav className='w-full select-none pt-[10vh] flex flex-col gap-[0.5vh]'>
				{[
					{
						label: 'Announcements',
						icon: <Megaphone />,
						selected: selectedMenu === 1,
						to: '/announcements',
					},
					{
						label: 'Queries',
						icon: <MessageCircle />,
						selected: selectedMenu === 2,
						to: '/coordinatorqueries',
					},
					{
						label: 'Deliverables',
						icon: <FileText />,
						selected: selectedMenu === 3,
						to: '/coordinatordeliverables',
					},
					{
						label: 'Checker',
						icon: <CheckCircle />,
						selected: selectedMenu === 4,
						to: '/checker',
					},
				].map((item, idx) => (
					<div
						key={item.label}
						className={`px-2 py-2 text-[1rem] ${
							item.selected ? fgClr : bgClr
						} ${
							item.selected && 'border-l-4 border-l-[#ffffff]'
						} cursor-pointer hover:text-[#f7c402] border border-transparent hover:border-t-[#f7c402] hover:border-b-[#f7c402] duration-300 font-semibold flex gap-2 items-center whitespace-nowrap overflow-hidden text-ellipsis`}
						onClick={() => {
							setSelectedMenu(idx + 1);
							navigate(item.to);
						}}
					>
						{item.icon} <span className='truncate'>{item.label}</span>
					</div>
				))}
			</nav>

			{/* Logout Button at Bottom */}
			<button
				onClick={() => {
					localStorage.removeItem('token');
					navigate('/login');
				}}
				className={`mt-auto ${fgClr} px-2 py-2 border-l-4 border-l-[#f4516c] hover:text-[#f4516c] cursor-pointer hover:border-t-[#f4516c] hover:border-b-[#f4516c] border border-transparent duration-300 w-full font-semibold select-none flex gap-2 items-center`}
			>
				<LogOut /> <span>Logout</span>
			</button>
		</div>
	);
};

export default CoordinatorLeftBar;
