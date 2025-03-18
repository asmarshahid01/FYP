import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import '../tailwind.css';
import LeftSideBar from './LeftSideBar';
import profileImage from '../assets/profile.jpg';
import postImage from '../assets/post.jpg';
import ProfileBar from './ProfileBar';
import RightSideBar from './RightSideBar';

const TeacherPage = () => {
    const bgClr = 'bg-[#f2f3f8]';

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
                            className='p-[1vw] h-fit mb-[4vh] w-5/6 text-[#333333]'>
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

            <RightSideBar></RightSideBar>
        </div>
    );
};

export default TeacherPage;