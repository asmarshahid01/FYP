import Fypgroup from "../models/fypgroup.js";
import Notification from "../models/notifications.js";
import Student from "../models/student.js";
import Supervisor from "../models/supervisor.js";



const makeAdmin=async(req,res)=>{
  console.log("Make Admin APi Working");
  try {
    const id=req.params.id;
    const adminId=req.body.adminId;
    const student=await Student.findById(id);
    const adminStudent=await Student.findById(adminId);
    if(student && adminStudent){
      student.role=true;
      adminStudent.role=false;
      await student.save();
      await adminStudent.save();
      return res.status(200).json({message:"Updated Successfully"});
    }
    else{
      return res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {

    return res.status(404).json({ message: "Error in ID " });    
  }
}

const approvalByAdmin = async (req, res) => {
	console.log("Error in API");
	try {
	  const id = req.params.id;
	  const status = parseInt(req.query.status, 10);

	  console.log(id,status);
  
	  
	  const group = await Fypgroup.findById(id).populate("studentsId");
	  if (!group) {
		return res.status(404).json({ message: "Group not found" });
	  }
  
	  
	  const leader = group.studentsId.find((val) => val.role === true);
	  if (!leader) {
		return res.status(400).json({ message: "No leader found in this group" });
	  }
	  const leaderId = leader._id;
  
	  let notiObject;
  
	  if (status === 1) {
		group.approved = true;
		await group.save();
  
		notiObject = {
		  requestType: "Admin",
		  message: "Your Group is Approved.",
		  receiver: leaderId,
		  receiverModel: "Student",
		  isRead: false,
		};
	  } else {
		group.approved = false;
		await group.save();
  
		notiObject = {
		  requestType: "Admin",
		  message: "Your Group is Rejected.",
		  receiver: leaderId,
		  receiverModel: "Student",
		  isRead: false,
		};
	  }
  
	  await Notification.insertOne(notiObject);
  
	  return res.status(200).json({ message: "Success" });
	} catch (error) {
	  console.error("Error in ADMIN APPROVAL:", error);
	  res.status(500).json({ message: "Error in ADMIN APPROVAL" });
	}
  };
  

const getGroupsForAdmin = async (req, res) => {
  try {
    const groups = await Fypgroup.find({approved:false})
      .populate("studentsId")
      .populate("supervisorId")
      .exec();

    if (groups?.length !== 0) {
      return res.status(200).json({ message: "Success", data: groups });
    } else {
      console.error("No Data AVAILABLE GroupsForAdmin:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error fetching GroupsForAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSupervisorGroups = async (req, res) => {
  const supervisorId = req.user.id;
  try {
    const supervisor = await Supervisor.findById(supervisorId)
      .populate({
        path: "fypGroups",
        populate: {
          path: "studentsId", // Assuming this is the field inside fypGroups that contains students
          model: "Student",
        },
      })
      .exec();

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    res.status(200).json(supervisor);
  } catch (error) {
    console.error("Error fetching supervisor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const findGroupByStudentId = async (req, res) => {
  try {
    const studentId = req.user.id;
    const group = await Fypgroup.findOne({ studentsId: studentId }).populate(
      "studentsId"
    );
    if (!group) {
      return res.status(200).json({ message: "Group not found" });
    }
    res.status(200).json({ message: "Success", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { title, type } = req.body;
    const group = await Fypgroup.findByIdAndUpdate(
      groupId,
      { title, type },
      { new: true }
    );
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({ message: "Group updated", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("Leaver:", studentId);
    const group = await Fypgroup.findOne({ studentsId: studentId }).populate(
      "studentsId"
    );
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    console.log(group);
    group.studentsId = group.studentsId.filter(
      (student) => student._id.toString() !== studentId
    );
    console.log(group);
    const student = await Student.findById(studentId);
    student.role = true;
    await student.save();
    if (group.studentsId.length === 1) {
      await group.deleteOne();
      return res.status(200).json({ message: "Left group successfully" });
    }
    await group.save();
    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  findGroupByStudentId,
  updateGroupById,
  leaveGroup,
  getSupervisorGroups,
  getGroupsForAdmin,
  approvalByAdmin,
  makeAdmin
};
