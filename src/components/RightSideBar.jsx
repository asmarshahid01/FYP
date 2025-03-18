import {React, useState, useMemo} from 'react'
import profileImage from '../assets/post.jpg';
import { Search } from 'lucide-react';

export default function RightSideBar() {
    const [selectedRole, setSelectedRole] = useState('students');
    const [searchQuery, setSearchQuery] = useState('');
    const [pending, setPending] = useState([]);
    const [accounts] = useState([
            'John Doe',
            'Jane Smith',
            'Alice Johnson',
            'Bob Brown',
            'Charlie White',
        ]);

    const bgClr = 'bg-[#f2f3f8]';

    // Filter accounts based on search query and selected role
        const filteredAccounts = useMemo(() => {
            return accounts.filter((account) => {
                return (
                    account.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    (selectedRole === 'students' || selectedRole === 'teachers') &&
                    searchQuery.length > 0
                );
            });
        }, [accounts, searchQuery, selectedRole]);

  return (
		<div className={`w-1/5 p-[1vw] ${bgClr} border-l-[0.1vw] border-[#D3D7EE] text-white`}>
            <div className='relative mb-[1vw] bg-[#ffffff] text-[#333333]'>
                <Search className='absolute left-[0.7vw] top-[0.7vw] text-[#333333]' />
                <input
                    type='text'
                    placeholder='Search...'
                    className={`w-full rounded-sm pl-[2.5vw] pr-[0.8vw] py-[0.5vw] focus:outline-none text-[0.9vw]`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Toggle Buttons */}
            <div
                className={`flex gap-[0.5vw] mb-[3vh] select-none rounded-sm p-[0.2vw] bg-[#3f51b5] shadow-lg`}
            >
                <div
                    onClick={() => setSelectedRole('students')}
                    className={`${
                        selectedRole === 'students' ? `bg-[#4e5fbb]` : 'bg-transparent'
                    } flex-1 text-center py-[0.5vw] rounded-sm cursor-pointer font-bold`}
                >
                    Students
                </div>
                <div
                    onClick={() => setSelectedRole('teachers')}
                    className={`${
                        selectedRole === 'teachers' ? `bg-[#4e5fbb]` : 'bg-transparent'
                    } flex-1 text-center py-[0.5vw] rounded-sm cursor-pointer font-bold`}
                >
                    Teachers
                </div>
            </div>

            {/* Account List */}
            <div className='space-y-[0.2vw]'>
                {selectedRole == 'students' && filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-[0.5vw] p-[0.5vw] shadow-lg rounded-sm select-none bg-[#3f51b5] transition`}
                        >
                            <img
                                src={profileImage}
                                className='w-[2.5vw] h-[2.5vw] rounded-full'
                                alt='Profile'
                            />
                            <p className='font-bold'>{account}</p>
                            <div
                                className={`ml-auto px-[1vw] py-[0.7vw] rounded-sm ${
                                    pending.includes(account) ? 'bg-[#f4516c]' : 'bg-[#4e5fbb]'
                                } transition ${
                                    pending.includes(account) && 'hover:bg-[#F33F5D]'
                                } cursor-pointer`}
                                onClick={() => {
                                    if (!pending.includes(account))
                                        setPending((prevItems) => [...prevItems, account]);
                                    else
                                        setPending((prevItems) =>
                                            prevItems.filter((item) => item !== account)
                                        );
                                }}
                            >
                                {pending.includes(account) ? 'Cancel' : 'Send Request'}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-500'>
                        {searchQuery.length > 0 ? 'No accounts found' : ''}
                    </p>
                )}
            </div>
        </div>
  )
}
