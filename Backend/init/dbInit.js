import dotenv from 'dotenv';
dotenv.config();
import Student from "../models/student.js";
import Supervisor from "../models/supervisor.js";
import mongoose from "mongoose";
// import connect from "../utils/dbConnect.js";
import bcrypt from 'bcrypt';


const createDummyUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash("12345678", 10);
    await connect();

    const dummyUsers = [
      {
        name: "Dr.Zeeshan Haider",
        email: "drZeeshanHaider@lhr.nu.edu.pk",
        password: hashedPassword,
        fypCount: 7,
        profile: "GEN AI ka kuch krdain",
      },
      {
        name: "Dr.Tahir Ijaz",
        email: "drTahirIjaz@lhr.nu.edu.pk",
        password: hashedPassword,
        fypCount: 7,
        profile: "GEN AI ka kuch krdain",
      },
      {
        name: "Dr.Zeeshan Ul Haq",
        email: "drZeeshanUlHaq@lhr.nu.edu.pk",
        password: hashedPassword,
        fypCount: 7,
        profile: "GEN AI ka kuch krdain",
      },
      {
        name: "Tahir Aslam",
        email: "tahirAslam@lhr.nu.edu.pk",
        password: hashedPassword,
        fypCount: 7,
        profile: "GEN AI ka kuch krdain",
      },
      {
        name: "Dr.Saif Aslam",
        email: "l21774@lhr.nu.edu.pk",
        password: hashedPassword,
        fypCount: 7,
        profile: "GEN AI ka kuch krdain",
      },
    ];
    await Supervisor.deleteMany({});
    await Supervisor.insertMany(dummyUsers);
    console.log("Dummy users created successfully.");
  } catch (error) {
    console.error("Error creating dummy users:", error);
  }
};



const connect = async () => {
    try {
        await mongoose.connect("mongodb+srv://saadsohail:saadsohail@dreams.jb3s9gv.mongodb.net/fastglide?retryWrites=true&w=majority&appName=Dreams", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error Connecting', error);
    }
};


createDummyUsers();
