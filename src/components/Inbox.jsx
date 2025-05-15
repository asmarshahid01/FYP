import React, { useState, useEffect } from "react";
import { Search, Send } from "lucide-react";
import LeftSideBar from "./LeftSideBar";
import profileImage from "../assets/profile.jpg";
import { io } from "socket.io-client";
import axios from "axios";
import { useSocket } from "../context/SocketContext";

const Inbox = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(null);
  const userId = JSON.parse(localStorage.getItem("userdetails"));
  const userRole = localStorage.getItem("usertype");
  const socket=useSocket();
  console.log(userId);
  console.log(userRole);



useEffect(() => {
  if (!socket) return; // 🔒 Guard clause
  console.log("NOT EVEN HERE????",socket);
  socket.on("newMessage", (message) => {
    console.log("WORKING??? message->",message);
    setMessages((prev) => ({
      ...prev,
      [message.senderId.id]: [
        ...(prev[message.senderId.id] || []),
        { text: message.message, sender: "other" },
      ],
    }));
  });

  return () => {
    socket.off("newMessage"); // It's better to clean the event, not disconnect here
  };
}, [socket]);



  useEffect(() => {
    const fetchUsersforSupervisors = async () => {
      console.log("Not working????")
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/api/supervisor/getStudents/get",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);

        if (response.status===404) {
          setUsers([]);
          return;
        }
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token ", token);
        const response = await axios.get(
          "http://localhost:4000/api/student/getSupervisor/get",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);

        setUsers(response.data.data); // [{_id, username}]
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (userRole === "Student") {
      fetchUsers();
    } else {
      fetchUsersforSupervisors();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:4000/api/chats/send/${selectedChat}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming JWT token
          },
          body: JSON.stringify({
            message: inputMessage,
            senderRole: userRole === "Teacher" ? "Supervisor" : "Student",
            recieverRole: userRole === "Teacher" ? "Student" : "Supervisor",
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const newMessage = await response.json();
      setMessages((prev) => ({
        ...prev,
        [selectedChat]: [
          ...(prev[selectedChat] || []),
          { text: newMessage.message, sender: "You" },
        ],
      }));
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const loadMessages = async (chatId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:4000/api/chats/${chatId}?senderRole=${
          userRole === "Teacher" ? "Supervisor" : "Student"
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming JWT token
          },
        }
      );

      if (!response.ok) throw new Error("Failed to load messages");

      const messages = await response.json();
      console.log(messages);
      setMessages((prev) => ({
        ...prev,
        [chatId]: messages.map((msg) => ({
          text: msg.message,
          sender: msg.senderId.id === userId.id ? "You" : "other",
        })),
      }));
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  useEffect(() => {
    if (selectedChat) loadMessages(selectedChat);
  }, [selectedChat]);

  const bgClr = "bg-[#f2f3f8]";
  const fgClr = "bg-[#3f51b5]";
  const borderClr = "border-[#282e3b]";
  const borderBgClr = "border-[#111820]";

  return (
    <div className="flex absolute h-full w-full top-0 left-0 bg-darkgray-100">
      {/* Left Sidebar (Existing) */}
      <LeftSideBar></LeftSideBar>

      {/* Chat List */}
      <div className={`w-1/6 bg-[#3f51b5] p-[0.8vw] absolute h-full left-1/7`}>
        <div className="relative mb-[1vw] shadow-lg">
          <Search className="absolute left-[0.7vw] top-[0.7vw] text-[#333333]" />
          <input
            type="text"
            placeholder="Search..."
            className={`w-full rounded-sm pl-[2.5vw] pr-[0.8vw] py-[0.5vw] bg-[#ffffff] text-[#333333] focus:outline-none text-[0.9vw]`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-[0.2vw]">
          {userRole === "Teacher" &&
            Array.isArray(users) &&
            users.map((user) => (
              <div
                key={user._id}
                className={`flex items-center gap-[0.5vw] p-[0.5vw] select-none px-[1vw] hover:bg-[#4e5fbb] transition py-[0.8vw] rounded-sm cursor-pointer font-bold ${
                  selectedChat === user._id ? "bg-[#4e5fbb]" : ""
                }`}
                onClick={() => setSelectedChat(user._id)}
              >
                <img
                  src={user.imageUrl ? `http://localhost:4000${user.imageUrl}` : profileImage}
                  className="w-[2vw] h-[2vw] rounded-full"
                  alt="Profile"
                />
                <p>{user.name}</p>
              </div>
            ))}
          {userRole === "Student" && users && typeof users === "object" && (
            <div
              key={users._id}
              className={`flex items-center gap-[0.5vw] p-[0.5vw] select-none px-[1vw] hover:bg-[#4e5fbb] transition py-[0.8vw] rounded-sm cursor-pointer font-bold ${
                selectedChat === users._id ? "bg-[#4e5fbb]" : ""
              }`}
              onClick={() => setSelectedChat(users._id)}
            >
              <img
                src={users.imageUrl ? `http://localhost:4000${users.imageUrl}` : profileImage}
                className="w-[2vw] h-[2vw] rounded-full"
                alt="Profile"
              />
              <p>{users.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col ${bgClr} border-l border-[#4e5fbb]`}
      >
        {selectedChat ? (
          <>
            <div
              className={`px-[1vw] py-[0.8vw] bg-[#3f51b5] cursor-pointer text-lg font-bold flex items-center gap-[0.7vw]`}
            >
              <img
                src={profileImage}
                className="w-[2.2vw] h-[2.2vw] rounded-full"
                alt="Profile"
              />
              <div>
                <p className="m-0 p-0 text-[0.8vw]">
                  {selectedChat ? users.name : ""}
                </p>
                <p className="m-0 p-0 text-[0.6vw] opacity-50 font-normal">
                  online
                </p>
              </div>
            </div>
            <div className="flex-1 p-[1vw] overflow-y-auto">
              {(messages[selectedChat] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`mb-[0.2vw] ${
                    msg.sender === "You" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block pl-[0.5vw] pr-[2vw] py-[0.5vw] rounded-sm text-[0.7vw] ${
                      msg.sender === "You" ? "bg-[#3f51b5]" : `bg-[#4e5fbb]`
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <div className={`p-[0.5vw] bg-[#3f51b5] flex items-center`}>
              <input
                type="text"
                className={`flex-1 bg-[#4e5fbb] rounded-sm px-[1vw] py-[0.8vw] text-[0.8vw] focus:outline-none`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <div
                onClick={handleSendMessage}
                className={`ml-2 bg-[#4e5fbb] px-[1vw] py-[0.9vw] h-auto rounded-sm cursor-pointer text-[1vw] text-[#cccccc] hover:text-[#ffffff] duration-300 transition`}
              >
                <Send className={``} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 opacity-50">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
