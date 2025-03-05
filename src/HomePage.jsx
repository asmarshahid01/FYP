import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import './tailwind.css'
import LeftSideBar from "./LeftSideBar";
import profileImage from './assets/profile.jpg'
import postImage from './assets/post.jpg'

const HomePage = () => {
    const bgClr = "bg-[#f2f3f8]";
    const fgClr = "bg-[#ffffff]";
    const borderClr = "border-[#282e3b]";
    const borderBgClr = "border-[#111820]";

    const [selectedOption, setSelectedOption] = useState("All");
    const [isOpen, setIsOpen] = useState(false);
    const [rightSideBarExpand, setRightSideBarExpand] = useState(false);
    const dropdownRef = useRef(null);

    const Card = ({ children, className, onClick}) => (
      <div className={`shadow-lg p-[1vw] bg-[#ffffff] border border-[#ffffff] ${className} rounded-sm duration-300 cursor-pointer`} onClick={onClick}>{children}</div>
    );

    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
  
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

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
        images: [postImage],
        request: true,
        requestSent: false,
      }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
  return (
    <div className="flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden">
      <LeftSideBar></LeftSideBar>

      {/* Main Feed */}
      <div className={`flex-1 p-[0.5vw] ${bgClr}`}>
        <div className="flex items-center justify-center">
          <div className={`relative w-2/3 mb-[1vw] ${fgClr} text-[#333333] flex gap-[0.5vw] items-center pl-[2.5vw] pr-[0.2vw] py-[0.2vw] `}>
            <Search className="absolute left-[0.7vw] top-[0.7vw] text-[#333333]" />
            <input 
              type="text" 
              placeholder="Search..." 
              className={`w-full rounded-sm focus:outline-none text-[0.9vw]`}/>
            <div className="relative w-[10vw]" ref={dropdownRef}>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-3/4 px-[0.8vw] py-[0.5vw] text-[#333] ${fgClr} rounded-sm
                focus:outline-none cursor-pointer ml-auto`}>
                {selectedOption}
                <ChevronDown className={`w-[0.8vw] h-[0.8vw] text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>

              {isOpen && (
                <div className={`absolute w-full mt-[0.5vw] ${fgClr} rounded-sm shadow-lg`}>
                  {["All", "Teachers", "Students"].map((option) => (
                    <div
                      key={option}
                      className="px-[1vw] py-[0.5vw] text-[#333] hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedOption(option);
                        setIsOpen(false);
                      }}>
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-y-auto h-full p-[2vw] flex flex-col items-center">
          {posts.map((post, index) => (
            <Card key={index} className="p-[1vw] h-fit mb-[4vh] w-5/6 text-[#333333]" onClick={()=>setRightSideBarExpand(!rightSideBarExpand)}>
              <div className="flex items-center justify-between select-none text-[#333333]">
                <div className="flex items-center gap-[1vw]">
                  <img src={post.profilePic} className="w-[3vw] h-[3vw] rounded-full flex items-center justify-center font-bold" alt="profile" />
                  <div>
                    <p className="font-bold">{post.name}</p>
                    <p className="text-gray-500">{post.postedDay}, {months[post.postedMonth]} {post.postedDate} {post.postedHour}:{post.postedMin}</p>
                  </div>
                </div>
              </div>
              <p className="mt-[0.5vw]">{post.content}</p>
              <div className="w-full mt-[0.8vw]">
                <img src={post.images[0]} key={index} className="h-auto w-full rounded-md flex items-center justify-center font-bold" alt="post" />
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

      {/* Right Sidebar */}
      <div className="h-full w-1/5 bg-[#f2f3f8] relative">
        <div className={`absolute top-0 right-0 h-full bg-[#355c7d] transition-all duration-500 ${rightSideBarExpand ? "w-full" : "w-0"}
        flex items-center justify-center`}>
        <div className={`h-full transition-all duration-500 ${rightSideBarExpand ? "min-w-full max-w-full" : "min-w-0 max-w-0"} 
        ${rightSideBarExpand ? "opacity-100" : "opacity-0"} relative overflow-hidden flex-shrink-0 flex flex-col items-center justify-center`}>
          <div className="relative w-[8vw] h-[8vw]">
            <img 
              src={profileImage} 
              className="w-full h-full rounded-full cursor-pointer"/>
          </div>
          <div className='flex flex-col items-center mt-[0.6vw]'>
            <p className='text-[1vw] font-bold select-none p-0 m-0'>John Doe</p>
            <p className="text-[0.7vw] text-[#aaaaaa] select-none p-0 m-0">Student</p>
          </div>
          <div className='w-full px-[1vw] flex flex-col gap-[1vh] items-center mt-[1vw]'>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HomePage;
