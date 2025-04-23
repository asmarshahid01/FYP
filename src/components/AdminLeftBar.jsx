import { React, useState, useRef, useEffect } from 'react';
import {
	Mail,
	Users,
	User,
	LogOut,
	ChevronRight,
	ChevronLeft,
} from 'lucide-react';

export default function AdminLeftBar() {
    const bgClr = 'bg-[#2a363b]';
	const fgClr = 'bg-[#292b3a]';
	const borderClr = 'border-[#282e3b]';

  return (
    <>
        <div className={`w-1/7 h-full ${bgClr} shadow-md flex flex-col items-center gap-[5vh] border-r-[0.1vw] ${borderClr} relative`}>
			{/* Profile Section (Absolute Positioning) */}
			<div className='w-full p-[0.5vw] absolute top-0 left-0'>
				<div className={`flex flex-col items-start w-full border border-[#555555] "bg-[#2a363b]" shadow-lg rounded-sm
        		p-[0.5vw] cursor-pointer hover:border-[#f7c402] duration-500 transition-all ease-in-out overflow-hidden "h-[7vh]"`}
				onClick={()=>{}}>
					<div className='flex justify-between w-full'>
						{/* User Info */}
						<div className='flex items-center w-full gap-[0.5vw]'>
							<img className='w-[2vw] h-[2vw] rounded-full'/>
							<div className='flex flex-col'>
								<p className='text-[1vw] font-bold select-none p-0 m-0'>
								    Name</p>
								<p className='text-[0.7vw] text-[#aaaaaa] select-none p-0 m-0'>
									Admin</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<nav className='w-full select-none pt-[35vh]'>
				<div className={`px-[1vw] py-[1vw] cursor-pointer hover:text-[#f7c402] border border-transparent hover:border-t-[#f7c402] hover:border-b-[#f7c402] 
                duration-300 font-bold flex gap-[0.5vw]`}
				onClick={() => {}}>
					<Users /> Groups
				</div>
			    <div className={`px-[1vw] py-[1vw]  cursor-pointer hover:text-[#f7c402] border border-transparent hover:border-t-[#f7c402] hover:border-b-[#f7c402] 
                duration-300 font-bold flex gap-[0.5vw]`}
				onClick={() => {}}>
					<User /> Accounts
				</div>
				</nav>

				{/* Logout Button at Bottom */}
				<button
					onClick={() => {}}
					className={`mt-auto ${fgClr} px-[1vw] py-[1vw] border-l-[0.2vw] border-l-[#f4516c] hover:text-[#f4516c] cursor-pointer hover:border-t-[#f4516c]
                    hover:border-b-[#f4516c] border border-transparent duration-300 w-full font-bold select-none flex gap-[0.5vw]`}>
					<LogOut /> Logout
				</button>
			</div>
    </>
  )
}
