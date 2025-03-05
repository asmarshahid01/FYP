import express from "express";
import mongoose from "mongoose";
import connect from "./utils/dbConnect";





await connect();

const app=express();
const port=8080;



app.listen(port,()=>{
    console.log("SERVER IS ON!!");
})