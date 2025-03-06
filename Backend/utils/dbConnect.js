import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connect=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB CONNECTED !")
    } catch (error) {
        console.log("Error Connecting ",error)
    }
}


export default connect;