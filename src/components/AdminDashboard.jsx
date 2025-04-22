import React, { useState } from "react";
import {
  ChevronRight
} from "lucide-react";
import AdminLeftBar from './AdminLeftBar'

export default function AdminDashboard() {
    const [groupsData, setGroupsData] = useState([
        {
          id: 1,
          groupName: "Team Alpha",
          members: [
            { name: "Alice", email: "alice@example.com", creditHours: 3 },
            { name: "Bob", email: "bob@example.com", creditHours: 4 },
          ],
        },
        {
          id: 2,
          groupName: "Team Beta",
          members: [
            { name: "Charlie", email: "charlie@example.com", creditHours: 2 },
            { name: "Dana", email: "dana@example.com", creditHours: 3 },
          ],
        },
        {
            id: 3,
            groupName: "Team Alpha",
            members: [
              { name: "Alice", email: "alice@example.com", creditHours: 3 },
              { name: "Bob", email: "bob@example.com", creditHours: 4 },
            ],
          },
          {
            id: 4,
            groupName: "Team Beta",
            members: [
              { name: "Charlie", email: "charlie@example.com", creditHours: 2 },
              { name: "Dana", email: "dana@example.com", creditHours: 3 },
            ],
          },
          {
            id: 5,
            groupName: "Team Alpha",
            members: [
              { name: "Alice", email: "alice@example.com", creditHours: 3 },
              { name: "Bob", email: "bob@example.com", creditHours: 4 },
            ],
          },
          {
            id: 6,
            groupName: "Team Beta",
            members: [
              { name: "Charlie", email: "charlie@example.com", creditHours: 2 },
              { name: "Dana", email: "dana@example.com", creditHours: 3 },
            ],
          },
          {
              id: 7,
              groupName: "Team Alpha",
              members: [
                { name: "Alice", email: "alice@example.com", creditHours: 3 },
                { name: "Bob", email: "bob@example.com", creditHours: 4 },
              ],
            },
            {
              id: 8,
              groupName: "Team Beta",
              members: [
                { name: "Charlie", email: "charlie@example.com", creditHours: 2 },
                { name: "Dana", email: "dana@example.com", creditHours: 3 },
              ],
            },
            {
                id: 9,
                groupName: "Team Beta",
                members: [
                  { name: "Charlie", email: "charlie@example.com", creditHours: 2 },
                  { name: "Dana", email: "dana@example.com", creditHours: 3 },
                ],
              },
              {
                  id: 10,
                  groupName: "Team Alpha",
                  members: [
                    { name: "Alice", email: "alice@example.com", creditHours: 3 },
                    { name: "Bob", email: "bob@example.com", creditHours: 4 },
                  ],
                },
                {
                  id: 11,
                  groupName: "Team Beta",
                  members: [
                    { name: "Charlie", email: "charlie@example.com", creditHours: 2 },
                    { name: "Dana", email: "dana@example.com", creditHours: 3 },
                  ],
                },
                {
                    id: 12,
                    groupName: "Team Alpha",
                    members: [
                      { name: "Alice", email: "alice@example.com", creditHours: 3 },
                      { name: "Bob", email: "bob@example.com", creditHours: 4 },
                    ],
                  },
                  {
                    id: 13,
                    groupName: "Team Beta",
                    members: [
                      { name: "Charlie", email: "charlie@example.com", creditHours: 2 },
                      { name: "Dana", email: "dana@example.com", creditHours: 3 },
                    ],
                  },
      ]);

    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [addStudent, setAddStudent] = useState(false);

    const toggleSelectAll = () => {
        if (selectedGroups.length === groupsData.length) {
          setSelectedGroups([]); // unselect all
        } else {
          setSelectedGroups(groupsData.map((group) => group.id)); // select all
        }
      };
      
      const toggleSelectOne = (id) => {
        setSelectedGroups((prev) =>
          prev.includes(id) ? prev.filter((gId) => gId !== id) : [...prev, id]
        );
      };
      

    const toggleExpand = (id) => {
        setExpandedRow((prev) => (prev === id ? null : id));
    };

    const handleAccept = (id) => {
        setGroupsData((prevGroups) => prevGroups.filter((group) => group.id !== id));
      };
      
      const handleReject = (id) => {
        setGroupsData((prevGroups) => prevGroups.filter((group) => group.id !== id));
      };  
      
      const handleSelectedAccept = () => {
        setGroupsData((prevGroups) => prevGroups.filter((group) => !selectedGroups.includes(group.id)));
        setSelectedGroups([]);
      };
      
      const handleSelectedReject = () => {
        setGroupsData((prevGroups) => prevGroups.filter((group) => !selectedGroups.includes(group.id)));
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
    <div className='flex absolute h-full w-full top-0 left-0 bg-[#f2f3f8] overflow-hidden'>
        <AdminLeftBar></AdminLeftBar>

        <div className="h-full absolute left-1/7 w-4/7 p-[2vw]">
            <h1 className="font-bold text-[#3f51b5] mb-[1vw]">Registered FYP Groups</h1>
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
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </label>
                                        #
                                    </div>
                                </th>
                                <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">{selectedGroups.length == 0 ? "Group" : selectedGroups.length + " selected"}</th>
                                <th className="p-[1vw] border-t border-b border-r border-[#eaebf0]"></th>
                                <th className="py-[1vw] pr-[2vw] border border-[#eaebf0] flex justify-end items-center h-full">{selectedGroups.length == 0 ? "Actions" : <div className="flex justify-end space-x-[0.5vw] h-full items-center">
                                    <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSelectedAccept()}>
                                        Accept
                                    </button>
                                    <button className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleSelectedReject()}>
                                        Reject
                                    </button>
                                </div>}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {groupsData.map((group, index) => (
                                <React.Fragment key={group.id}>
                                <tr className={`border-b ${selectedGroups.includes(group.id) ? "bg-[#ccddff]" : "hover:bg-gray-50"} transition duration-300 cursor-pointer`}>
                                    <td className="py-[1vw] px-[0vw] border border-[#eaebf0] text-center" onClick={()=>{toggleSelectOne(group.id)}}>
                                        <div className="flex items-center justify-center gap-[1vw]">
                                            <label
                                                onClick={(e) => e.stopPropagation()}
                                                className="relative inline-flex items-center justify-center h-[1vw] w-[1vw] bg-white border border-gray-300 rounded-sm">
                                                <input type="checkbox" checked={selectedGroups.includes(group.id)} onChange={() => toggleSelectOne(group.id)}
                                                className="appearance-none h-[1vw] w-[1vw] cursor-pointer peer"/>
                                                {/* Checkmark */}
                                                <svg className="absolute h-[0.8vw] w-[0.8vw] text-[#4e5fbb] hidden peer-checked:block pointer-events-none"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </label>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="p-[1vw] border-t border-b border-l border-[#eaebf0] cursor-pointer" onClick={() => toggleExpand(group.id)}>{group.groupName}</td>
                                    <td className="border-t border-b border-r border-[#eaebf0] p-[0.5vw] text-center w-[2vw] cursor-pointer" onClick={() => toggleExpand(group.id)}>
                                        <button className="flex items-center justify-center w-full h-full cursor-pointer">
                                            <ChevronRight />
                                        </button>
                                    </td>
                                    <td className="p-[1vw] border border-[#eaebf0]" onClick={()=>e.stopPropagation()}>
                                        <div className="flex justify-end space-x-[0.5vw]">
                                            {selectedGroups.length == 0 ? <>
                                                <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                                onClick={() => {handleAccept(group.id)}}>
                                                    Accept
                                                </button>
                                                <button className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                                onClick={() => {handleReject(group.id)}}>
                                                    Reject
                                                </button>
                                            </> : <>
                                                <div className="min-h-[2.05vw] min-w-[6vw]">
                                                </div>
                                            </>}
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
            <h2 className="font-bold text-[#3f51b5] mb-[1vw] w-full text-center text-[2vw]">F24-89</h2>
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
                    {groupsData.find((group) => group.id === expandedRow)?.members.map((member, i) => (
                        <tr key={i} className="h-[3vw]">
                            <td className="text-center">{member.name}</td>
                            <td className="text-center">{member.email}</td>
                            <td className="text-center">{member.creditHours}</td>
                            <td className="text-center">
                                <button className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                onClick={()=>{removeStudentFromGroup(expandedRow, member.email)}}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-[1.5vw] font-bold text-[#444444] mt-[1vw]">Supervisor</p>
            <div className="w-full h-[1vw] shadow-lg rounded-sm mt-[1vw] flex text-[#444444] text-[0.7vw] px-[1vw] py-[1.5vw] items-center justify-center border border-[#eaebf0]">
                <p className="flex-1 font-bold">Zeeshan Ali Khan</p>
                <p className="flex-1">zeeshan.alikhan@lhr.nu.edu.pk</p>
            </div>
            {!addStudent ? <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer mt-[1vw]"
            onClick={()=>setAddStudent(true)}>Add a student</button> : <div className="">
                <input type="text" placeholder="l21xxxx@lhr.nu.edu.pk" className="h-[2vw] w-[12vw] shadow-lg border border-[#eaebf0] rounded-sm text-[#333333] p-[1vw] focus:outline-none" />
                <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer mt-[1vw] ml-[0.5vw] shadow-lg"
                onClick={()=>{addStudentToGroup(expandedRow, {name: "Asmar", email: "iamasmar20@gmail.com", creditHours: 4})}}>Save</button>
                <button className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer mt-[1vw] ml-[0.2vw] shadow-lg"
                onClick={()=>setAddStudent(false)}>Cancel</button>
            </div>}
        </div>
        )}
    </div>
  )
}
