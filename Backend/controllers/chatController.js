import Chat from "../models/chat.js";
import Message from "../models/message.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  console.log("CHAT API HIT");
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;
    const senderModel = req.body.senderRole;
    const recieverModel = req.body.recieverRole;

    let chat = await Chat.findOne({
      participants: {
        $all: [
          {$elemMatch:{ id: senderId, model: senderModel }},
          {$elemMatch:{ id: receiverId, model: recieverModel }}, // Ensure you pass the receiver model
        ],
      },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [
          { id: senderId, model: senderModel },
          { id: receiverId, model: recieverModel },
        ],
      });
    }

    const newMessage = new Message({
      senderId: { id: senderId, model: senderModel },
      receiverId: { id: receiverId, model: recieverModel },
      message,
    });

    if (newMessage) {
      chat.messages.push(newMessage._id);
    }

    await chat.save();
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log("RECIEVER ID is ",receiverId);
    console.log("RECIEVER SOCKET IS ",receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json("Internal Sever Error");
  }
};

export const getMessages = async (req, res) => {
  console.log("GET MSG API");

  const senderModel = req.query.senderRole;
  const recieverModel = senderModel === "Supervisor" ? "Student" : "Supervisor";

  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    // console.log("Sender ID:", senderId);
    // console.log("Receiver ID:", userToChatId);
    // console.log("Sender Role:", senderModel);
    // console.log("Receiver Role:", recieverModel);

    // Find the conversation
    const conversation = await Chat.findOne({
      participants: {
        $all: [
          { $elemMatch: { id: senderId, model: senderModel } },
          { $elemMatch: { id: userToChatId, model: recieverModel } },
        ],
      },
    }).populate("messages");

    // If no conversation found, return empty array
    if (!conversation) {
      console.log("No conversation found.");
      return res.status(200).json([]);
    }

    // Return the messages
    // console.log("Conversation Found:", conversation);
    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

