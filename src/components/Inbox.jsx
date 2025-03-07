import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';
import LeftSideBar from './LeftSideBar';
import profileImage from '../assets/profile.jpg';

const Inbox = () => {
	const [selectedChat, setSelectedChat] = useState(null);
	const [messages, setMessages] = useState({});
	const [inputMessage, setInputMessage] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const chats = ['Alice', 'Bob', 'Charlie', 'David'];

	const filteredChats = chats.filter((chat) => {
		return chat.toLowerCase().includes(searchQuery.toLowerCase());
	});

	const handleSendMessage = () => {
		if (!inputMessage.trim()) return;
		setMessages((prev) => ({
			...prev,
			[selectedChat]: [
				...(prev[selectedChat] || []),
				{ text: inputMessage, sender: 'You' },
			],
		}));
		setMessages((prev) => ({
			...prev,
			[selectedChat]: [
				...(prev[selectedChat] || []),
				{ text: 'same', sender: 'other' },
			],
		}));
		setInputMessage('');
	};

	const bgClr = 'bg-[#111820]';
	const fgClr = 'bg-[#282e3b]';
	const borderClr = 'border-[#282e3b]';
	const borderBgClr = 'border-[#111820]';

	return (
		<div className='flex absolute h-full w-full top-0 left-0 bg-darkgray-100'>
			{/* Left Sidebar (Existing) */}
			<LeftSideBar></LeftSideBar>

			{/* Chat List */}
			<div className={`w-1/6 ${bgClr} border-r ${borderClr} p-[0.8vw]`}>
				<div className='relative mb-[1vw]'>
					<Search className='absolute left-[0.7vw] top-[0.7vw] text-[#fbfbfb]' />
					<input
						type='text'
						placeholder='Search...'
						className={`w-full rounded-sm pl-[2.5vw] pr-[0.8vw] py-[0.5vw] ${fgClr} text-white focus:outline-none text-[0.9vw]`}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='space-y-[0.2vw]'>
					{filteredChats.map((chat) => (
						<div
							key={chat}
							className={`flex items-center gap-[0.5vw] p-[0.5vw] select-none px-[1vw] hover:${fgClr} transition py-[0.8vw] rounded-sm cursor-pointer font-bold ${
								selectedChat === chat ? `${fgClr} text-white` : 'bg-darkgray'
							}`}
							onClick={() => setSelectedChat(chat)}
						>
							<img
								src={profileImage}
								className='w-[2vw] h-[2vw] rounded-full'
								alt='Profile'
							/>
							<p>{chat}</p>
						</div>
					))}
				</div>
			</div>

			{/* Chat Window */}
			<div className={`flex-1 flex flex-col ${bgClr}`}>
				{selectedChat ? (
					<>
						<div
							className={`px-[1vw] py-[0.7vw] border-b ${borderClr} cursor-pointer text-lg font-bold flex items-center gap-[0.7vw]`}
						>
							<img
								src={profileImage}
								className='w-[2vw] h-[2vw] rounded-full'
								alt='Profile'
							/>
							<p>{selectedChat}</p>
						</div>
						<div className='flex-1 p-[1vw] overflow-y-auto'>
							{(messages[selectedChat] || []).map((msg, index) => (
								<div
									key={index}
									className={`mb-[0.2vw] ${
										msg.sender === 'You' ? 'text-right' : 'text-left'
									}`}
								>
									<span
										className={`inline-block pl-[0.5vw] pr-[2vw] py-[0.3vw] rounded-sm text-[0.7vw] ${
											msg.sender === 'You'
												? 'bg-blue-400 text-white'
												: `${fgClr}`
										}`}
									>
										{msg.text}
									</span>
								</div>
							))}
						</div>
						<div
							className={`p-[0.5vw] border-t ${borderClr} flex items-center`}
						>
							<input
								type='text'
								className={`flex-1 ${fgClr} rounded-sm px-[1vw] py-[0.8vw] text-[0.8vw] focus:outline-none`}
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								placeholder='Type a message...'
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleSendMessage();
									}
								}}
							/>
							<div
								onClick={handleSendMessage}
								className={`ml-2 ${fgClr} px-[1vw] py-[0.9vw] h-auto rounded-sm cursor-pointer text-[1vw] text-gray-500 hover:text-blue-400 transition`}
							>
								<Send className={``} />
							</div>
						</div>
					</>
				) : (
					<div className='flex items-center justify-center flex-1 text-gray-500'>
						Select a chat to start messaging
					</div>
				)}
			</div>
		</div>
	);
};

export default Inbox;
