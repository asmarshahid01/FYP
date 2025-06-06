import Supervisor from "../models/supervisor.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { match } from "assert";

const { JWT_SECRET } = process.env;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = "./uploads/supervisor/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `temp_${Date.now()}${path.extname(file.originalname)}`); // Temporary name
  },
});

const upload = multer({ storage });

const updateBio = async (req, res) => {
  const userID = req.user.id;
  if (!userID) {
    res.status(400).json({ message: "Unauthorized User found", err });
  }

  const user = await Supervisor.findById(userID);
  if (!user) {
    res.status(400).json({ message: "No Such User exists in the system", err });
  }

  user.profile = req.body.bio;

  if (req.file) {
    const rollNumber = req.body.fileName;
    if (!rollNumber) {
        return res.status(400).json({ message: "Roll number is required" });
    }

    // Get the temporary file path from multer
    const tempFilePath = req.file.path; // Check this path in logs


    // Define the upload directory
    const uploadDir = path.join(__dirname, '..', 'uploads', 'supervisor');

    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate the new file path
    const newFileName = `${rollNumber}${path.extname(req.file.originalname)}`;
    const newFilePath = path.join(uploadDir, newFileName);

    console.log("New File Path:", newFilePath);

    // **Delete old image if it exists**
    if (user.imageUrl) {
        const existingFilePath = path.join(__dirname, '..', user.imageUrl);
        if (fs.existsSync(existingFilePath)) {
            fs.unlinkSync(existingFilePath);
        }
    }

    // **Ensure the file actually exists before renaming**
    if (fs.existsSync(tempFilePath)) {
        fs.renameSync(tempFilePath, newFilePath);
    } else {
        return res.status(500).json({ message: "Uploaded file not found on server" });
    }

    user.imageUrl = `/uploads/supervisor/${newFileName}`;
}
  await user.save();
  res.status(200).json({ message: "Updated Successfully", bio: req.body.bio });
};

const getInfo = async (req, res) => {
    console.log("TESTING THE APIII");
    try {
      const userID = req.user.id;
      if (!userID) {
        res.status(400).json({ message: "Unauthorized User found", err });
      }
      const user = await Supervisor.findById(userID);
      if (!user) {
        res
          .status(400)
          .json({ message: "No Such User exists in the system", err });
      }
  
      const userDetails = {
        name: user.name,
        email: user.email,
        profile: user.profile,
        imageUrl: user?.imageUrl || "",
      };
  
      res.status(200).json({
        message: "Success",
        userDetails,
      });
    } catch (error) {
      res.status(400).json({ message: "Network Error ", err });
    }
  };

const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const user = await Supervisor.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "No teacher with that email!" });
    }
    const isMatched = bcrypt.compareSync(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect password!" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "8h",
    });
    const usertype = "Teacher";
    const userdetails = {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
    };
    console.log(userdetails);
    res
      .status(200)
      .json({ message: "Login successful", token, usertype, userdetails });
  } catch (err) {
    res.status(400).json({ message: "Some error in login", err });
  }
};

const getSupervisorById = async (req, res) => {
  console.log("Get Supervisor by ID");
  try {
    const user = await Supervisor.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Supervisor not found" });
    }
    const userDetails = {
      id: req.params.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      fypCount: user.fypCount,
      imageUrl: user?.imageUrl || "",
    };
    res.status(200).json({
      message: "Success",
      userDetails,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};



const getStudents=async(req,res)=>{

  // console.log("Inside getSTU");
	try{
		const userID = req.user.id;


		const results=await Supervisor.findById(userID).populate({
			path:'fypGroups',
			populate:{
				path:'studentsId',
        match:{role:true}
			},
		});
    console.log(results);

    if (!results || !results.fypGroups || results.fypGroups.length === 0) {
      return res.status(404).json({ message: "No FYP groups or supervisor not found" });
    }
    const students = results.fypGroups.flatMap(group => group.studentsId);
    console.log("Students ",students);

		return res.status(200).json({message:"Success",data:students});
	
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}


}

export { getSupervisorById, login,upload,updateBio,getInfo,getStudents };
