// import React, {
//     useState,
//     useEffect,
//     useRef,
//     useMemo,
//     useCallback,
// } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Search, ChevronDown } from 'lucide-react';
// import '../tailwind.css';
// import LeftSideBar from './LeftSideBar';
// import profileImage from '../assets/profile.jpg';
// import ProfileBar from './ProfileBar';
// import { format } from 'date-fns';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { debounce } from 'lodash';
// import RightSideBar from './RightSideBar';

// const Card = ({ children, className, onClick }) => (
//     <div
//         className={`shadow-lg p-[1vw] bg-[#ffffff] border border-[#ffffff] ${className} rounded-sm duration-300 cursor-pointer`}
//         onClick={onClick}
//     >
//         {children}
//     </div>
// );

// const AdminHome = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');
//     const bgClr = 'bg-[#f2f3f8]';
//     const fgClr = 'bg-[#ffffff]';
//     const borderClr = 'border-[#282e3b]';
//     const borderBgClr = 'border-[#111820]';

//     const [selectedOption, setSelectedOption] = useState('All');
//     const [isOpen, setIsOpen] = useState(false);
//     const [requestMsg, setRequestMsg] = useState('');
//     const [trigger, setTrigger] = useState(true);
//     const [groups,setGroups]=useState([]);
//     const dropdownRef = useRef(null);

//     const [pending, setPending] = useState([]);
//     const [accounts] = useState([
//         'John Doe',
//         'Jane Smith',
//         'Alice Johnson',
//         'Bob Brown',
//         'Charlie White',
//     ]);

//     const [content, setContent] = useState('');

//     const [posts, setPosts] = useState([]);
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true);
//     const initialRender = useRef(true);

//     useEffect(()=>{
//         const fetchGroups=async()=>{
//             try {
//                 const results=await axios.get("http://localhost:4000/api/group/admins");
//                 if(results.status===200){
//                     setGroups(results.data.data);
//                     console.log(results.data.data);
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchGroups();
//     },[])

//     return (
//         <div className='flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden'>
//             {/* <LeftSideBar></LeftSideBar> */}

//             {/* Main Feed */}
//             <div
//                 className={`flex-1 py-[0.5vw] px-[5vw] ${bgClr} overflow-auto flex-col items-center`}
//             >
//                 <div className='flex items-center justify-center'>
//                     <div
//                         className={`relative w-full shadow-lg mb-[1vw] ${fgClr} text-[#333333] flex gap-[0.5vw] items-center pl-[2.5vw] pr-[0.2vw] py-[0.2vw] `}
//                     >
//                         {/* <Search className='absolute left-[0.7vw] top-[0.7vw] text-[#333333]' />
//                         <input
//                             type='text'
//                             placeholder='Search...'
//                             className={`w-full rounded-sm focus:outline-none text-[0.9vw]`}
//                         />
//                         <div className='relative w-[10vw]' ref={dropdownRef}>
//                             <div
//                                 onClick={() => setIsOpen(!isOpen)}
//                                 className={`flex items-center justify-between w-3/4 px-[0.8vw] py-[0.5vw] text-[#333] ${fgClr} rounded-sm
//                 focus:outline-none cursor-pointer ml-auto`}
//                             >
//                                 {selectedOption}
//                                 <ChevronDown
//                                     className={`w-[0.8vw] h-[0.8vw] text-gray-600 transition-transform ${
//                                         isOpen ? 'rotate-180' : ''
//                                     }`}
//                                 />
//                             </div>

//                             {isOpen && (
//                                 <div
//                                     className={`absolute w-full mt-[0.5vw] bg-[#3f51b5] rounded-sm shadow-lg`}
//                                 >
//                                     {['All', 'Teachers', 'Students'].map((option) => (
//                                         <div
//                                             key={option}
//                                             className='px-[1vw] py-[0.5vw] text-white hover:bg-[#4e5fbb] cursor-pointer'
//                                             onClick={() => {
//                                                 setSelectedOption(option);
//                                                 setIsOpen(false);
//                                             }}
//                                         >
//                                             {option}
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div> */}
//                     </div>
//                 </div>
//                 <div className='w-full flex flex-col items-start gap-[1vh]'>
//                     {/* <textarea
//                         className='text-[#333333] shadow-lg rounded-sm p-[0.8vw] text-[0.8vw] focus:outline-none bg-white resize-none overflow-auto w-full'
//                         placeholder='Write a post...'
//                         value={content}
//                         onChange={(e) => setContent(e.target.value)}
//                         rows={3}
//                     />
//                     <div
//                         className='py-[0.6vw] px-[1vw] bg-[#3f51b5] transition hover:bg-[#4e5fbb] flex items-center justify-center font-bold
//                         rounded-sm cursor-pointer shadow-lg hover:shadow-[#4e5fbb] duration-500 text-[#eeeeee] flex-[2] mb-[2vw]'
//                         onClick={handleCreatePost}
//                     >
//                         Create Post
//                     </div> */}
//                 </div>
//                 <div className='h-fit flex flex-col pb-[2vw]'>
//                     {/* <InfiniteScroll
//                         dataLength={posts.length}
//                         next={fetchPosts}
//                         hasMore={hasMore}
//                         loader={
//                             <div className='flex items-center justify-center text-[#333333]'>
//                                 <p className='text-[#aaaaaa]'>Loading...</p>
//                             </div>
//                         }
//                         endMessage={<p style={{ textAlign: 'center' }}>No more posts</p>}
//                     >
//                         {posts.map((post) => (
//                             <Card
//                                 key={post._id}
//                                 className='mb-[4vh] w-full text-[#333333] flex-1 shadow-lg'
//                                 //onClick={() => setRightSideBarExpand(!rightSideBarExpand)}
//                                 onClick={() =>
//                                     navigate(
//                                         `/profile/${post.author?._id}?role=${
//                                             post.authorModel === 'Supervisor'
//                                                 ? 'Teacher'
//                                                 : post.authorModel
//                                         }`
//                                     )
//                                 }
//                             >
//                                 <div className='flex items-center justify-between select-none text-[#333333]'>
//                                     <div className='flex items-center gap-[1vw]'>
//                                         <img
//                                             src={
//                                                 post.author?.imageUrl
//                                                     ? `http://localhost:4000${post.author.imageUrl}`
//                                                     : profileImage || profileImage
//                                             }
//                                             className='w-[3vw] h-[3vw] rounded-full flex items-center justify-center font-bold'
//                                             alt='profile'
//                                         />
//                                         <div>
//                                             <p className='font-bold'>{post.author?.name}</p>
//                                             <p className='text-gray-500'>
//                                                 {formatDate(post.createdAt)}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <p className='mt-[0.5vw]'>{post.content}</p>
//                             </Card>
//                         ))}
//                     </InfiniteScroll> */}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminHome;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../tailwind.css";
import LeftSideBar from "./LeftSideBar";
import profileImage from '../assets/profile.jpg';
import AdminLeftBar from "./AdminLeftBar";

const AdminHome = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  // Fetch groups from API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/group/admins"
        );
        if (response.status === 200) {
          setGroups(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);

  // Handle group approval
  const handleApprove = async (groupId,status) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/group/approve/${groupId}?status=${status}`
      );
      if (response.status === 200) {
        alert("Group Approved Successfully!");
      }
    } catch (error) {
      console.error("Error approving group:", error);
    }
  };

  return (
    <div className="flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden">
      <AdminLeftBar/>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard - Group Approvals
        </h1>
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
          {groups.length > 0 ? (
            groups.map((group) => (
              <div
                key={group._id}
                className="bg-gray-50 rounded-lg p-4 mb-4 shadow-md"
              >
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {group.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Supervisor: {group.supervisorId?.name}
                    </p>
                  </div>
                  <span className="text-md font-semibold text-blue-600">
                    Meetings: {group.meetingCount}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {group.studentsId.map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm"
                    >
                      <img
                        src={
                          student?.imageUrl
                            ? `http://localhost:4000${student.imageUrl}`
                            : profileImage || profileImage
                        }
                        alt={student.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleApprove(group._id,1)}
                  className="mt-4 w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-all"
                >
                  Approve Group
                </button>
                <button
                  onClick={() => handleApprove(group._id,2)}
                  className="mt-4 w-full px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-all"
                >
                  Reject Group
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No groups pending approval.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
