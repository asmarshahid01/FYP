import React, { useState } from "react";
import { Search } from "lucide-react";
import './tailwind.css'
import LeftSideBar from "./LeftSideBar";
import profileImage from './assets/profile.jpg'
import postImage from './assets/post.jpg'

const HomePage = () => {
    const bgClr = "bg-[#111820]";
    const fgClr = "bg-[#282e3b]";
    const borderClr = "border-[#282e3b]";
    const borderBgClr = "border-[#111820]";

    const Card = ({ children, className }) => (
      <div className={`shadow p-[1vw] ${fgClr} ${className} rounded-sm`}>{children}</div>
    );

    const [posts, setPosts] = useState([
      {
        profilePic: profileImage,
        name: 'Sir Zeeshan',
        postedDate: 3,
        postedDay: "Monday",
        postedMonth: 2,
        postedYear: 2025,
        postedHour: 12,
        postedMin: 30,
        content: "Hello, found this amazing",
        images: [postImage]
      }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
  return (
    <div className="flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden">
      <LeftSideBar></LeftSideBar>


      {/* Main Feed */}
      <div className={`flex-1 p-[0.5vw] ${bgClr} border-r ${borderClr}`}>
        <div className="flex items-center justify-center mb-[1vw]">
          <div className="relative w-1/2 mb-[1vw]">
            <Search className="absolute left-[0.7vw] top-[0.7vw] text-[#fbfbfb]" />
            <input 
              type="text" 
              placeholder="Search..." 
              className={`w-full rounded-sm pl-[2.5vw] pr-[0.8vw] py-[0.5vw] ${fgClr} text-white focus:outline-none text-[0.9vw]`}
            />
          </div>
        </div>
        <div className="overflow-y-auto h-full p-[2vw]">
          {posts.map((post, index) => (
            <Card key={index} className="p-[1vw] h-fit mb-[2vh] w-7/10">
              <div className="flex items-center gap-[1vw] select-none">
                <img src={post.profilePic} className="w-[3vw] h-[3vw] rounded-full flex items-center justify-center font-bold" alt="profile" />
                <div>
                  <p className="font-bold">{post.name}</p>
                  <p className="text-gray-500">{post.postedDay}, {months[post.postedMonth]} {post.postedDate} {post.postedHour}:{post.postedMin}</p>
                </div>
              </div>
              <p className="mt-[0.5vw]">{post.content}</p>
              <div className="w-full mt-[0.8vw]">
                <img src={post.images[0]} key={index} className="h-auto w-full rounded-md flex items-center justify-center font-bold" alt="post" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`w-1/5 ${bgClr} flex flex-col justify-center gap-[10vh] select-none p-[0.5vw]`}>
        <div>
          <h2 className="text-lg font-bold mb-[0.8vw]">Deadline Calendar</h2>
          <div className={`h-[30vh] ${fgClr} border border-transparent hover:border-[0.1vw] hover:border-blue-500 duration-300`}></div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-[0.8vw]">Deliverables Timeline</h2>
          <div>
            {["Task 1", "Task 2", "Task 3"].map((task, index) => (
              <div key={index} className={`p-[1vw] ${fgClr} flex items-center justify-between m-0 border border-transparent hover:border-[0.1vw] hover:border-blue-500 duration-300`}>
                <p className="font-bold">{task}</p>
                <span className="text-sm text-gray-500">Due Date</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
