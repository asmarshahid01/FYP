import Student from "../models/student.js";
import Supervisor from "../models/supervisor.js";
import csv from "csv-parser";
import fs from "fs";
import bcrypt from 'bcrypt';
import { request } from "http";
import { group } from "console";




const fetchStudents=async(req,res)=>{
    console.log("FetchStudentsByAdmin Working");
    try {
        const students= await Student.find().select('name email role');
        if(!students || students.length===0){
            return res.status(404).json({message:"Students not Found"});
        }
        else{
            return res.status(200).json({message:"Success",data:students});
        }
    } catch (error) {
        return res.status(400).json({message:"Error IN SERVER"});
    }
}


const fetchSupervisors=async(req,res)=>{
    console.log("FetchSupervisorsByAdmin Working");
    try {
        const supervisor= await Supervisor.find().select('name email fypCount');
        if(!supervisor || supervisor.length===0){
            return res.status(404).json({message:"Supervisors not Found"});
        }
        else{
            return res.status(200).json({message:"Success",data:supervisor});
        }
    } catch (error) {
        return res.status(400).json({message:"Error IN SERVER"});
    }
}

const AddStudentsDb=async(req,res)=>{
    console.log("TESTING");
    try {

        const results=[];

        fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data",(data)=>{
            results.push(data);
        })
        .on("end",async()=>{
            try {
                console.log(req.body.status);

            if(req.body.status==='supervisor'){
                await Supervisor.insertMany(results);
            }
            else{
                await Student.insertMany(results);
            }
                console.log("Data POPULATED");
                console.log(results);
                fs.unlinkSync(req.file.path);

                res.status(200).json({message:"Data is shown Successfully"});
            } catch (error) {
                console.error("DB Insert Error:", error);
          res.status(500).json({ error: "Error inserting data into DB", details: error });
            }
        })


        
    } catch (error) {
        console.error("File Read Error:", error);
    res.status(500).json({ error: "Error reading CSV file", details: error });
    }
}



const AddSingle=async(req,res)=>{

    const data=req.body.data;
    const type=req.body.type;
    console.log(data);
    console.log(type);

    try {   
        if(type==="student"){
            const password=await bcrypt.hash(data.password,10);
            const user={
                name:data.name,
                password:password,
                email:data.email,
                role:false,
                requests:[],
                notificatons:[],
                profile:"I Love Fast",
                imageUrl:"",
                gpa:data.gpa
                
            }
            await Student.insertOne(user);
            console.log("User Added Successfully");
            return res.status(200).json({message:"User Added Successfully"});
        }
        else if(type==="supervisor"){
            const password=await bcrypt.hash(data.password,10);
            const user={
                name:data.name,
                password:password,
                email:data.email,
                fypCount:data.fypCount,
                requests:[],
                notificatons:[],
                profile:"I Love Fast",
                imageUrl:"",
            }
            await Supervisor.insertOne(user);
            console.log("User Added Successfully");
            return res.status(200).json({message:"User Added Successfully"});
        }
    } catch (error) {
        console.log("Something Went Wrong",error);
        return res.status(500).json({message:"Something Went Wrong Server"});
    }


}



const DeleteSingle=async(req,res)=>{
    console.log("DELETE SINGLE API WORKING");
    const id=req.params.id;
    const type=req.body.type;
    console.log(id);
    console.log(type);
    try {
        if(type==="student"){
            await Student.deleteOne({_id:id});
            return res.status(200).json({message:"Deleted Successfully"});
        }
        else if(type==="supervisor"){
            await Supervisor.deleteOne({_id:id});
            return res.status(200).json({message:"Deleted Successfully"});
        }
    } catch (error) {
        console.log("Something went wrong ",error);
        return res.status(500).json({message:"Something Went Wrong with the Server"});
    }
}



const updateDataStudent=async(req,res)=>{
    const {id}=req.params;

    try {

        const user=await Student.findById(id);
        if(!user){
            return res.status(404).json({message:"Not found"});
        }
        user.name=req.body.name;
        const password=await bcrypt.hash(req.body.password,10);
        user.password=password;

        await user.save();

        return res.status(200).json({message:"Success"});
        
    
    } catch (error) {
        return res.status(500).json({message:"Something Went Wrong with the Server"});
    }



}


const updateDataSupervisor=async(req,res)=>{
const {id}=req.params;

    try {
        const user=await Supervisor.findById(id);
        if(!user){
            return res.status(404).json({message:"Not found"});
        }
        user.name=req.body.name;
        const password=await bcrypt.hash(req.body.password,10);
        user.password=password;
        user.fypCount=req.body.slot;

        await user.save();

        return res.status(200).json({message:"Success"});
        
    
    } catch (error) {
        return res.status(500).json({message:"Something Went Wrong with the Server"});
    }
}

export {AddStudentsDb,fetchStudents,fetchSupervisors,AddSingle,DeleteSingle,updateDataStudent,updateDataSupervisor};