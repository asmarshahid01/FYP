import Supervisor from "../models/supervisor.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const { JWT_SECRET } = process.env;


  
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
        fypCount:user.fypCount,
        imageUrl:user?.imageUrl||"",
      };
      res.status(200).json({
        message: "Success",
        userDetails,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };


  export {getSupervisorById};