import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser,authRole } = useAuthContext();

  useEffect(() => {
    if (authUser && (authUser?.role || authRole==="Teacher")) {
      console.log("WORKING HERE???", authUser.id);

      // Initialize the socket connection
      const so = io("http://localhost:4000", {
        query: { userId: authUser?.id },
      });

      setSocket(so);
      so.on("connect",()=>{
        console.log("SOCKET CONNECTED ,",so.id);
      })

      // Cleanup on unmount
      return () => {
        so.disconnect(); // Use 'so' directly here
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
