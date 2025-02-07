import React from 'react'
import profileImage from "./assets/profile.jpg";
import { Home, Mail, Users, FileText, LogOut } from "lucide-react";

const LeftSideBar = () => {
  const bgClr = "bg-[#111820]";
  const fgClr = "bg-[#282e3b]";
  const borderClr = "border-[#282e3b]";
  const borderBgClr = "border-[#111820]";

  return (
    <div className={`w-1/8 h-full ${bgClr} shadow-md flex flex-col items-center gap-[5vh] border-r-[0.1vw] ${borderClr}`}>
        <h1 className="text-2xl font-bold p-[1vw] text-left select-none">FastGlide</h1>
        <div className="flex flex-col items-center gap-[1vh] mb-6">
        <img src={profileImage} className="w-[6vw] h-[6vw] rounded-full" />
        <p className="text-[1vw] font-semibold select-none">John Doe</p>
        </div>
        <nav className="w-full select-none">
        <div className={`px-[1vw] py-[0.7vw] ${fgClr} hover:border-t-blue-400 hover:border-b-blue-400 border border-transparent duration-300 font-bold flex gap-[0.5vw]`}>{<Home></Home>}Dashboard</div>
        <div className={`px-[1vw] py-[0.7vw] ${bgClr} hover:border-t-blue-400 hover:border-b-blue-400 border border-transparent duration-300 font-bold flex gap-[0.5vw]`}>{<Mail></Mail>}Inbox</div>
        <div className={`px-[1vw] py-[0.7vw] ${bgClr} hover:border-t-blue-400 hover:border-b-blue-400 border border-transparent duration-300 font-bold flex gap-[0.5vw]`}>{<Users></Users>}FYP Group</div>
        <div className={`px-[1vw] py-[0.7vw] ${bgClr} hover:border-t-blue-400 hover:border-b-blue-400 border border-transparent duration-300 font-bold flex gap-[0.5vw]`}>{<FileText></FileText>}Deliverables</div>
        </nav>
        <div className={`mt-auto ${fgClr} px-[1vw] py-[0.7vw] hover:border-t-red-400 hover:border-b-red-400 border border-transparent duration-300 w-full font-bold select-none flex gap-[0.5vw]`}>{<LogOut></LogOut>}Logout</div>
    </div>
  )
}

export default LeftSideBar;