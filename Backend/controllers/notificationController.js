import Notification from "../models/notifications.js";



const getNotification=async(req,res)=>{
    console.log("Hello in notiifcation");
    const userId=req.user.id;
    console.log(userId);
    try {
        const notification=await Notification.find({receiver:userId});
        if(notification){
            return res.status(200).json({message:"Success",data:notification});
        }
        else{
            return res.status(201).json({message:"Empty"});
        }

    } catch (error) {
        console.log("Error in NOtification");
        return res.status(500).json({message:"Not Successfull"});
    }

}


export{getNotification}