import React, { useState } from "react";
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
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


  return (
    <div className='flex absolute h-full w-full top-0 left-0 bg-[#f2f3f8] overflow-hidden'>
        <AdminLeftBar></AdminLeftBar>

        <div className="w-[60vw] max-h-[70vh] overflow-auto mx-auto text-black absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-sm">
            <div className="min-w-[600px]">
                <table className="w-full border-collapse border border-[#eaebf0] text-[0.7vw]">
                        <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-[1vw] border border-[#eaebf0]">
                                <div className="flex items-center justify-center gap-[1vw]">#
                                    <input
                                        type="checkbox"
                                        checked={selectedGroups.length === groupsData.length}
                                        onChange={toggleSelectAll}
                                        className="cursor-pointer h-[1vw] w-[1vw] accent-[#f2f3f8]"/>
                                </div>
                            </th>
                            <th className="p-[1vw] border-t border-b border-l border-[#eaebf0]">{selectedGroups.length == 0 ? "Group" : selectedGroups.length + " selected"}</th>
                            <th className="p-[1vw] border-t border-b border-r border-[#eaebf0]"></th>
                            <th className="py-[1vw] pr-[2vw] border border-[#eaebf0] flex justify-end">{selectedGroups.length == 0 ? "Actions" : <div className="flex justify-end space-x-[0.5vw]">
                                <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSelectedAccept()}>
                                    <Check className="h-[1vw] w-[1vw]" />
                                    Accept
                                </button>
                                <button className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSelectedReject()}>
                                    <X className="h-[1vw] w-[1vw]" />
                                    Reject
                                </button>
                            </div>}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {groupsData.map((group, index) => (
                            <React.Fragment key={group.id}>
                            <tr className={`border-b ${selectedGroups.includes(group.id) ? "bg-[#ccddff]" : "hover:bg-gray-50"} transition duration-300 cursor-pointer`}
                            onClick={()=>{toggleSelectOne(group.id)}}>
                                <td className="py-[1vw] px-[0vw] border border-[#eaebf0] text-center">
                                    <div className="flex items-center justify-center gap-[1vw]">{index + 1}
                                        <input
                                            type="checkbox"
                                            checked={selectedGroups.includes(group.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => toggleSelectOne(group.id)}
                                            className="cursor-pointer h-[1vw] w-[1vw] accent-[#f2f3f8]"/>
                                    </div>
                                </td>
                                <td className="p-[1vw] border-t border-b border-l border-[#eaebf0] cursor-pointer" onClick={() => toggleExpand(group.id)}>{group.groupName}</td>
                                <td className="border-t border-b border-r border-[#eaebf0] p-[0.5vw] text-center w-[2vw] cursor-pointer" onClick={() => toggleExpand(group.id)}>
                                    <button className="flex items-center justify-center w-full h-full cursor-pointer">
                                        {expandedRow === group.id ? (
                                        <ChevronUp className="h-[1vw] w-[1vw]" />
                                        ) : (
                                        <ChevronDown className="h-[1vw] w-[1vw]" />
                                        )}
                                    </button>
                                </td>
                                <td className="p-[1vw] border border-[#eaebf0]">
                                    <div className="flex justify-end space-x-[0.5vw]">
                                        {selectedGroups.length == 0 ? <>
                                            <button className="bg-[#4e5fbb] hover:bg-[#3f51b5] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                            onClick={() => handleAccept(group.id)}>
                                                <Check className="h-[1vw] w-[1vw]" />
                                                Accept
                                            </button>
                                            <button className="bg-[#f4516c] hover:bg-[#ea4762] transition duration-300 text-[#fff] font-bold px-[1vw] py-[0.5vw] rounded-sm inline-flex items-center gap-1 cursor-pointer"
                                            onClick={() => handleReject(group.id)}>
                                                <X className="h-[1vw] w-[1vw]" />
                                                Reject
                                            </button>
                                        </> : <>
                                            <div className="min-h-[2.05vw] min-w-[11.1vw]">
                                            </div>
                                        </>}
                                    </div>
                                </td>
                            </tr>
                            <tr className="bg-[#f2f3f8] transition-all duration-300">
                                <td colSpan="4" className="p-0">
                                    <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        expandedRow === group.id ? "max-h-[500px] p-[1vw]" : "max-h-0 p-0"
                                    }`}
                                    >
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-[0.7vw]">
                                        <thead>
                                            <tr className="text-gray-700 border-b border-[#eaebf0]">
                                            <th className="p-2 text-left">Member Name</th>
                                            <th className="p-2 text-left">Email</th>
                                            <th className="p-2 text-left">Credit Hours</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.members.map((member, i) => (
                                            <tr key={i} className="border-t border-[#eaebf0]">
                                                <td className="p-2">{member.name}</td>
                                                <td className="p-2">{member.email}</td>
                                                <td className="p-2">{member.creditHours}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                        </table>
                                    </div>
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
  )
}
