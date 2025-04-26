import express from "express";
import authenticate from "../middleware.js";
import multer from "multer";
import {
  AddStudentsDb,
  fetchStudents,
  fetchSupervisors,
  AddSingle,
  DeleteSingle
} from "../controllers/adminController.js";

const upload = multer({ dest: "dataUploads/" });

const router = express.Router();

router.get("/fetchStudents", fetchStudents);
router.get("/fetchSupervisors", fetchSupervisors);
router.post("/populate/DB", upload.single("file"), AddStudentsDb);
router.post("/addSingle/DB", AddSingle);
router.delete('/delete/DB/:id',DeleteSingle);

export default router;
