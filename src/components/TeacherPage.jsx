import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import '../tailwind.css';
import LeftSideBar from './LeftSideBar';
import profileImage from '../assets/profile.jpg';
import postImage from '../assets/post.jpg';
import ProfileBar from './ProfileBar';

const TeacherPage = () => {
    const bgClr = 'bg-[#f2f3f8]';

    const [rightSideBarExpand, setRightSideBarExpand] = useState(false);

    const [selectedRole, setSelectedRole] = useState("students");
    const [searchQuery, setSearchQuery] = useState("");
    const [pending, setPending] = useState([]);
    const [accounts] = useState([
        "John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Charlie White"
      ]);
      
      // Filter accounts based on search query and selected role
      const filteredAccounts = accounts.filter(account => {
        return (
          account.toLowerCase().includes(searchQuery.toLowerCase()) && 
          (selectedRole === "students" || selectedRole === "teachers") &&
          searchQuery.length > 0
        );
      });

    const Card = ({ children, className, onClick }) => (
        <div
            className={`shadow-lg p-[1vw] bg-[#ffffff] border border-[#ffffff] ${className} rounded-sm duration-300 cursor-pointer`}
            onClick={onClick}
        >
            {children}
        </div>
    );

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
            <ProfileBar profileId={1}></ProfileBar>

            {/* Main Feed */}
            <div className={`flex-1 p-[0.5vw] ml-[3.3vw] ${bgClr}`}>
                <div className='flex items-center justify-center'>
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
            <div className={`w-1/5 p-[1vw] ${bgClr} border-l-[0.1vw] border-[#D3D7EE] text-white`}>
                <div className="relative mb-[1vw] bg-[#ffffff] text-[#333333]">
                <Search className="absolute left-[0.7vw] top-[0.7vw] text-[#333333]" />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className={`w-full rounded-sm pl-[2.5vw] pr-[0.8vw] py-[0.5vw] focus:outline-none text-[0.9vw]`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                
                {/* Toggle Buttons */}
                <div className={`flex gap-[0.5vw] mb-[3vh] select-none rounded-sm p-[0.2vw] bg-[#3f51b5] shadow-lg`}>
                <div onClick={() => setSelectedRole("students")} 
                    className={`${selectedRole === "students" ? `bg-[#4e5fbb]` : "bg-transparent"} flex-1 text-center py-[0.5vw] rounded-sm cursor-pointer font-bold`}>
                    Students</div>
                <div onClick={() => setSelectedRole("teachers")} className={`${selectedRole === "teachers" ? `bg-[#4e5fbb]` : "bg-transparent"} flex-1 text-center py-[0.5vw] rounded-sm cursor-pointer font-bold`}>
                    Teachers</div>
                </div>
                
                {/* Account List */}
                <div className="space-y-[0.2vw]">
                {selectedRole == "students" && filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account, index) => (
                    <div key={index} className={`flex items-center gap-[0.5vw] p-[0.5vw] shadow-lg rounded-sm select-none bg-[#3f51b5] transition`}>
                        <img src={profileImage} className="w-[2.5vw] h-[2.5vw] rounded-full" alt="Profile" />
                        <p className="font-bold">{account}</p>
                        <div className={`ml-auto px-[1vw] py-[0.7vw] rounded-sm ${pending.includes(account) ? "bg-[#f4516c]" : "bg-[#4e5fbb]"} transition ${pending.includes(account) && "hover:bg-[#F33F5D]"} cursor-pointer`}
                        onClick={()=>{
                            if(!pending.includes(account)) setPending((prevItems) => [...prevItems, account]);
                            else setPending((prevItems) => prevItems.filter((item) => item !== account));
                            }}>
                        {pending.includes(account) ? "Cancel" : "Send Request"}
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500">{searchQuery.length > 0 ? "No accounts found" : ""}</p>
                )}
                </div>
            </div>
        </div>
    );
};

export default TeacherPage;