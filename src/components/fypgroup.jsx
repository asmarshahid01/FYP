import React, { useState } from "react";
import profileImage from "../assets/profile.jpg";
import { Pencil, ChevronDown } from "lucide-react";
import LeftSideBar from "./LeftSideBar";

const FYPGroupPage = () => {
  const [title, setTitle] = useState("Group Title");
  const [selectedCategory, setSelectedCategory] = useState("Development");
  const [isChanged, setIsChanged] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Development", "R&D"];
  
  const [pending, setPending] = useState(["Alice", "Bob", "Charlie"]);
  const [groupMembers, setGroupMembers] = useState([{
	name: "Me",
	admin: true,
	}, {
		name: "Alice",
		admin: false
	}
	]);
  const [receivedRequests, setReceivedRequests] = useState([{
		name: "Bob",
		month: 2,
		date: 22,
		year: 2025
  }])

  const bgClr = "bg-[#f2f3f8]";
  const fgClr = "bg-[#3f51b5]";

  // const bgClr = "bg-[#2b2b2b]";
  // const fgClr = "bg-[#565656]";
  // const borderClr = "border-[#565656]";

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
    <div className="flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden">
      
      <LeftSideBar/>

      {/* Main Content */}
      <div className={`flex-1 py-[1vw] pl-[1vw] pr-[5vw] ${bgClr} text-[#333333] overflow-auto`}>
        {/* Editable Title */}
        <div className="flex items-center gap-[0.8vw] border-b border-[#D3D7EE] w-full p-[1vw]">
          {/* Edit Icon */}
          <Pencil className="h-[1.2vw] w-[1.2vw] text-gray-500 cursor-pointer" />
          {/* Editable Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => {setTitle(e.target.value); setIsChanged(true)}}
            className="text-[2vw] font-bold bg-transparent focus:outline-none text-[#4e5fbb]"
          />

          {/* Save Button */}
          {isChanged && <div className="bg-[#3f51b5] hover-bg-[#4e5fbb] duration-300 text-white pl-[1.5vw] pr-[1.5vw] pt-[0.3vw] pb-[0.3vw] select-none cursor-pointer font-bold rounded-sm ml-auto">Save</div>}
        </div>
        
        {/* Dropdown Menu */}
        <div className="relative inline-block text-left font-bold select-none">
          {<div
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 ${fgClr} pl-[1.5vw] pr-[1.5vw] pt-[0.5vw] pb-[0.5vw] mt-[1vw] cursor-pointer font-bold text-white rounded-sm hover:bg-[#4e5fbb] transition`}>
            {selectedCategory}
            <ChevronDown className="h-[0.7vw] w-[0.7vw]" />
          </div>}

          {/* Dropdown Menu */}
          {isOpen && (
            <div className={`absolute mt-[0.5vw] w-[8vw] ${fgClr} text-white rounded-sm shadow-lg shadow-gray-900`}>
              {options.map((option, index) => (
                <div
                  key={index}
                  className="px-[1vw] py-[0.5vw] hover:bg-[#4e5fbb] cursor-pointer transition"
                  onClick={()=>{setSelectedCategory(option); setIsOpen(false)}}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group members */}
        <h2 className="text-xl font-bold mt-[5vh] mb-[1vh] text-[#4e5fbb]">Group Members</h2>
        <div className="flex flex-col gap-[0.5vh]">{groupMembers.length > 0 ? groupMembers.map((member, index) => (
			<div key={index} className="space-y-[0.2vw]">
				<div className={`flex items-center gap-[0.5vw] px-[0.5vw] py-[0.5vw] shadow-lg rounded-sm w-1/3 bg-[#3f51b5] text-white`}>
				<img src={profileImage} className="w-[2.5vw] h-[2.5vw] rounded-full" />
				{member.admin ? <div className="flex flex-col">
					<p className="font-bold">{member.name}</p>
					<p className="opacity-50">Admin</p>
				</div> : <p className="font-bold">{member.name}</p>}
				{member.name == "Me" ? <div className={`ml-auto bg-[#f4516c] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#F33F5D] transition`}
				onClick={()=>setGroupMembers([])}>Leave</div> :
				<div className={`ml-auto bg-[#f4516c] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#F33F5D] transition`}
				onClick={()=>setGroupMembers((prevItems) => prevItems.filter((item) => item !== member))}>Remove</div>}
				</div>
			</div>
		)) : <p className="opacity-50">No Group Members</p>}</div>

		{/* Received Requests */}
        <h2 className="text-xl font-bold mt-[5vh] mb-[1vh] text-[#4e5fbb]">Received Requests</h2>
        <div className="overflow-x-auto w-3/4">
          <table className="min-w-full table-auto border-collapse select-none rounded-sm shadow-lg">
              <thead>
                <tr className={`bg-[#3f51b5] text-white`}>
                  <th className="px-[1vw] py-[0.7vw] text-left">User</th>
                  <th className="px-[1vw] py-[0.7vw] text-left">Sent on</th>
                  <th className="px-[1vw] py-[0.7vw] text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receivedRequests.length > 0 ? receivedRequests.map((user, index) => (
                  <tr key={index} className={index%2==0 ? "bg-[#ffffff]" : "bg-[#f7f7f7]"}>
                    <td className="px-[1vw] py-[0.7vw] flex items-center gap-[0.5vw] font-bold">
                      <img src={profileImage} className="w-[2.5vw] h-[2.5vw] rounded-full" alt="Profile" />
                      <p className="text-[#4e5fbb]">{user.name}</p>
                    </td>
                    <td className="text-[#99A1D6]">{months[user.month]} {user.date}, {user.year}</td>
                    <td className="px-[1vw] py-[0.7vw]">
                      <div
                        className={`inline-block bg-[#3f51b5] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#4e5fbb] text-white transition`}
                        onClick={() => {
                          setReceivedRequests((prevItems) => prevItems.filter((item) => item !== user));
						  setGroupMembers((prevItems) => [...prevItems, {name: user.name, admin: false}])
                        }}>
                        Accept
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colspan={3} className="w-full text-center"><p className="opacity-50 mt-[2vh]">No pending requests</p></td></tr>}
              </tbody>
            </table>
        </div>

        {/* Pending Requests */}
        <h2 className="text-xl font-bold mt-[5vh] mb-[1vh] text-[#4e5fbb]">Sent Requests</h2>
        <div className="overflow-x-auto w-3/4">
          <table className="min-w-full table-auto border-collapse select-none rounded-sm shadow-lg">
              <thead>
                <tr className={`bg-[#3f51b5] text-white`}>
                  <th className="px-[1vw] py-[0.7vw] text-left">User</th>
                  <th className="px-[1vw] py-[0.7vw] text-left">Sent on</th>
                  <th className="px-[1vw] py-[0.7vw] text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.length > 0 ? pending.map((user, index) => (
                  <tr key={index} className={index%2==0 ? "bg-[#ffffff]" : "bg-[#f7f7f7]"}>
                    <td className="px-[1vw] py-[0.7vw] flex items-center gap-[0.5vw] font-bold">
                      <img src={profileImage} className="w-[2.5vw] h-[2.5vw] rounded-full" alt="Profile" />
                      <p className="text-[#4e5fbb]">{user}</p>
                    </td>
                    <td className="text-[#99A1D6]">Feb 22, 2025</td>
                    <td className="px-[1vw] py-[0.7vw]">
                      <div
                        className={`inline-block bg-[#f4516c] font-bold px-[1vw] py-[0.7vw] cursor-pointer rounded-sm hover:bg-[#F33F5D] text-white transition`}
                        onClick={() => {
                          setPending((prevItems) => prevItems.filter((item) => item !== user));
                        }}>
                        Cancel
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colspan={3} className="w-full text-center"><p className="opacity-50 mt-[2vh]">No pending requests</p></td></tr>}
              </tbody>
            </table>
        </div>

        
        {/* Registration Deadline */}
        <h2 className="text-xl font-bold mt-[5vh] text-[#4e5fbb]">Registration Deadline:</h2>
        <p className="text-lg text-[#4e5fbb]">March 31, 2025</p>
      </div>
    </div>
  );
};

export default FYPGroupPage;