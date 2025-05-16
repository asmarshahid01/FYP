import { Server } from "socket.io";
import http from 'http';
import express from 'express'

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:["http://localhost:3000"],
        methods:["GET","POST","DELETE","PATCH","PUT"]
    }
});

export const getReceiverSocketId=(receiverId)=>{
    return userSocket[receiverId];
}


const userSocket={}

io.on("connection",(socket)=>{
    console.log("A User Connected ",socket.id);
    const userId=socket.handshake.query.userId;
    console.log("User ID is=",userId);
    if(userId !== undefined){
        userSocket[userId]=socket.id;
    }



    // io.emit("getOnlineUsers",Object.keys(userSocket));



    socket.on("disconnect",()=>{
        console.log("Disconnected",socket.id);
        delete userSocket[userId];
        // io.emit("getOnlineUsers",Object.keys(userSocket));

    })
})





export {app,io,server}