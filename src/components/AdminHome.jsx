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

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../tailwind.css";
// import LeftSideBar from "./LeftSideBar";
// import profileImage from '../assets/profile.jpg';
// import AdminLeftBar from "./AdminLeftBar";

// const AdminHome = () => {
//   const navigate = useNavigate();
//   const [groups, setGroups] = useState([]);

//   // Fetch groups from API
//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/group/admins"
//         );
//         if (response.status === 200) {
//           setGroups(response.data.data);
//           console.log(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching groups:", error);
//       }
//     };
//     fetchGroups();
//   }, []);

//   // Handle group approval
//   const handleApprove = async (groupId,status) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:4000/api/group/approve/${groupId}?status=${status}`
//       );
//       if (response.status === 200) {
//         alert("Group Approved Successfully!");
//       }
//     } catch (error) {
//       console.error("Error approving group:", error);
//     }
//   };

//   return (
//     <div className="flex absolute h-full w-full top-0 left-0 bg-darkgray-100 overflow-hidden">
//       <AdminLeftBar/>
//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">
//           Admin Dashboard - Group Approvals
//         </h1>
//         <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
//           {groups.length > 0 ? (
//             groups.map((group) => (
//               <div
//                 key={group._id}
//                 className="bg-gray-50 rounded-lg p-4 mb-4 shadow-md"
//               >
//                 <div className="flex justify-between items-center border-b pb-3 mb-3">
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-900">
//                       {group.title}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Supervisor: {group.supervisorId?.name}
//                     </p>
//                   </div>
//                   <span className="text-md font-semibold text-blue-600">
//                     Meetings: {group.meetingCount}
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   {group.studentsId.map((student) => (
//                     <div
//                       key={student._id}
//                       className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm"
//                     >
//                       <img
//                         src={
//                           student?.imageUrl
//                             ? `http://localhost:4000${student.imageUrl}`
//                             : profileImage || profileImage
//                         }
//                         alt={student.name}
//                         className="w-10 h-10 rounded-full"
//                       />
//                       <div>
//                         <p className="font-medium text-gray-800">
//                           {student.name}
//                         </p>
//                         <p className="text-sm text-gray-500">{student.email}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   onClick={() => handleApprove(group._id,1)}
//                   className="mt-4 w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-all"
//                 >
//                   Approve Group
//                 </button>
//                 <button
//                   onClick={() => handleApprove(group._id,2)}
//                   className="mt-4 w-full px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-all"
//                 >
//                   Reject Group
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center">
//               No groups pending approval.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useGlobalLoader } from "../context/LoaderContext";
import { ChevronRight } from "lucide-react";
import AdminLeftBar from "./AdminLeftBar";

export default function AdminDashboard() {
  const { hideLoader, showLoader } = useGlobalLoader();
  const [groupsData, setGroupsData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState();
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [addStudent, setAddStudent] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      showLoader();
      try {
        const response = await axios.get(
          "http://localhost:4000/api/group/admins"
        );
        if (response.status === 200) {
          setGroupsData(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        hideLoader();
      }
    };
    fetchGroups();
  }, []);

  // const handleApprove = async (groupId,status) => {
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:4000/api/group/approve/${groupId}?status=${status}`
  //     );
  //     if (response.status === 200) {
  //       alert("Group Approved Successfully!");
  //       setGroupsData((prevGroups) => prevGroups.filter((group) => group.id !== id));
  //     }
  //   } catch (error) {
  //     console.error("Error approving group:", error);
  //   }
  // };

  const toggleSelectAll = () => {
    if (selectedGroups.length === groupsData.length) {
      setSelectedGroups([]); // unselect all
    } else {
      console.log("Here in Select ALl");
      setSelectedGroups(groupsData.map((group) => group._id)); // select all
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((gId) => gId !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
    setSelectedGroup(groupsData.find((group) => group._id === id));
  };

  const handleAccept = async (groupId, status) => {
    showLoader();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/group/approve/${groupId}?status=${status}`
      );
      if (response.status === 200) {
        setGroupsData((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupId)
        );
        toast.success("Approved Successfully");
      }
    } catch (error) {
      console.error("Error approving group:", error);
    } finally {
      hideLoader();
    }
  };

  const handleReject = async (groupId, status) => {
    showLoader();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/group/approve/${groupId}?status=${status}`
      );
      if (response.status === 200) {
        setGroupsData((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupId)
        );
        toast.success("Rejected Successfully");
      }
    } catch (error) {
      console.error("Error rejecting group:", error);
    } finally {
      hideLoader();
    }
  };

  const handleSelectedAccept = () => {
    setGroupsData((prevGroups) =>
      prevGroups.filter((group) => !selectedGroups.includes(group._id))
    );
    setSelectedGroups([]);
  };

  const handleSelectedReject = () => {
    setGroupsData((prevGroups) =>
      prevGroups.filter((group) => !selectedGroups.includes(group._id))
    );
    setSelectedGroups([]);
  };

  const addStudentToGroup = (groupId, newStudent) => {
    setGroupsData((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, members: [...group.members, newStudent] }
          : group
      )
    );
  };

  const removeStudentFromGroup = (groupId, studentEmail) => {
    setGroupsData((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.filter(
                (member) => member.email !== studentEmail
              ),
            }
          : group
      )
    );
  };

  return (
    <div className="flex absolute h-full w-full top-0 left-0 bg-[#f2f3f8] overflow-hidden">
      <AdminLeftBar></AdminLeftBar>

      <div className="h-full absolute left-1/7 w-4/7 p-[2vw]">
        <h1 className="font-bold text-[#3f51b5] mb-[1vw]">
          Registered FYP Groups
        </h1>
        <div className="max-h-[85vh] overflow-auto mx-auto text-black shadow-lg rounded-sm">
          <div className="min-w-[600px]">
            <table className="w-full border-collapse border border-[#eaebf0] text-[0.7vw]">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-[1vw] border border-[#eaebf0]">
                    <div className="flex items-center justify-center gap-[1vw]">
                      <label className="relative inline-flex items-center justify-center h-[1vw] w-[1vw] bg-[#f2f3f8] rounded-sm border border-gray-300">
                        <input
                          type="checkbox"
                          checked={selectedGroups.length === groupsData.length}
                          onChange={toggleSelectAll}
                          className="appearance-none cursor-pointer h-[1vw] w-[1vw] peer"
                        />
                        <svg
                          className="absolute h-[0.8vw] w-[0.8vw] text-[#4e5fbb] hidden peer-checked:block pointer-events-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </label>
                      #
                    </div>
                  </th>
                  <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">
                    {selectedGroups.length == 0
                      ? "Group"
                      : selectedGroups.length + " selected"}
                  </th>
                  <th className="p-[1vw] border-t border-b border-r border-[#eaebf0]"></th>
                  <th className="py-[1vw] pr-[2vw] border border-[#eaebf0] flex justify-end items-center h-full">
                    {selectedGroups.length == 0 ? (
                      "Actions"
                    ) : (
                      <div className="flex justify-end space-x-[0.5vw] h-full items-center">
                        <button
                          className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                          onClick={() => handleSelectedAccept()}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                          onClick={() => handleSelectedReject()}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupsData.map((group, index) => (
                  <React.Fragment key={group._id}>
                    <tr
                      className={`border-b ${
                        selectedGroups.includes(group._id)
                          ? "bg-[#ccddff]"
                          : "hover:bg-gray-50"
                      } transition duration-300 cursor-pointer`}
                    >
                      <td
                        className="py-[1vw] px-[0vw] border border-[#eaebf0] text-center"
                        onClick={() => {
                          toggleSelectOne(group._id);
                        }}
                      >
                        <div className="flex items-center justify-center gap-[1vw]">
                          <label
                            onClick={(e) => e.stopPropagation()}
                            className="relative inline-flex items-center justify-center h-[1vw] w-[1vw] bg-white border border-gray-300 rounded-sm"
                          >
                            <input
                              type="checkbox"
                              checked={selectedGroups.includes(group._id)}
                              onChange={() => toggleSelectOne(group._id)}
                              className="appearance-none h-[1vw] w-[1vw] cursor-pointer peer"
                            />
                            {/* Checkmark */}
                            <svg
                              className="absolute h-[0.8vw] w-[0.8vw] text-[#4e5fbb] hidden peer-checked:block pointer-events-none"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </label>
                          {index + 1}
                        </div>
                      </td>
                      <td
                        className="p-[1vw] border-t border-b border-l border-[#eaebf0] cursor-pointer"
                        onClick={() => toggleExpand(group._id)}
                      >
                        {group.title}
                      </td>
                      <td
                        className="border-t border-b border-r border-[#eaebf0] p-[0.5vw] text-center w-[2vw] cursor-pointer"
                        onClick={() => toggleExpand(group._id)}
                      >
                        <button className="flex items-center justify-center w-full h-full cursor-pointer">
                          <ChevronRight />
                        </button>
                      </td>
                      <td
                        className="p-[1vw] border border-[#eaebf0]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end space-x-[0.5vw]">
                          {selectedGroups.length == 0 ? (
                            <>
                              <button
                                className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                onClick={() => {
                                  handleAccept(group._id, 1);
                                }}
                              >
                                Accept
                              </button>
                              <button
                                className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                onClick={() => {
                                  handleReject(group._id, 2);
                                }}
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="min-h-[2.05vw] min-w-[6vw]"></div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*Right bar*/}
      {/* Right bar */}
      {expandedRow && (
        <div className="h-full w-2/7 absolute left-5/7 shadow-lg p-4 overflow-y-auto flex flex-col items-center justify-center">
          <h2 className="font-bold text-[#3f51b5] mb-[1vw] w-full text-center text-[2vw]">
            F24-89
          </h2>
          <table className="text-[#000] w-full border border-[#eaebf0] text-[0.7vw] rounded-sm shadow-lg">
            <thead>
              <tr className="h-[2vw] border-b border-b-[#eaebf0]">
                <th>Name</th>
                <th>Email</th>
                <th>Cr. Hrs.</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedGroup?.studentsId.map((member, i) => (
                <tr key={i} className="h-[3vw]">
                  <td className="text-center">{member.name}</td>
                  <td className="text-center">{member.email}</td>
                  <td className="text-center">{100}</td>
                  <td className="text-center">
                    <button
                      className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        removeStudentFromGroup(expandedRow, member.email);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[1.5vw] font-bold text-[#444444] mt-[1vw]">
            Supervisor
          </p>
          <div className="w-full h-[1vw] shadow-lg rounded-sm mt-[1vw] flex text-[#444444] text-[0.7vw] px-[1vw] py-[1.5vw] items-center justify-center border border-[#eaebf0]">
            <p className="flex-1 font-bold">
              {selectedGroup?.supervisorId.name}
            </p>
            <p className="flex-1">{selectedGroup?.supervisorId.email}</p>
          </div>
          {!addStudent ? (
            <button
              className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer mt-[1vw]"
              onClick={() => setAddStudent(true)}
            >
              Add a student
            </button>
          ) : (
            <div className="">
              <input
                type="text"
                placeholder="l21xxxx@lhr.nu.edu.pk"
                className="h-[2vw] w-[12vw] shadow-lg border border-[#eaebf0] rounded-sm text-[#333333] p-[1vw] focus:outline-none"
              />
              <button
                className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer mt-[1vw] ml-[0.5vw] shadow-lg"
                onClick={() => {
                  addStudentToGroup(expandedRow, {
                    name: "Asmar",
                    email: "iamasmar20@gmail.com",
                    creditHours: 4,
                  });
                }}
              >
                Save
              </button>
              <button
                className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer mt-[1vw] ml-[0.2vw] shadow-lg"
                onClick={() => setAddStudent(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
