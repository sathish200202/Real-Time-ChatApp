import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

//get users controller for sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar controller ", error.message);
    req.status(500).json({ message: "Server error" });
  }
};

//get messages Controller
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    //get the all messages from me to another user
    const messages = await Message.find({
      $or: [
        //in the first one, i am the sender and another user is second
        { senderId: myId, receiverId: userToChatId },
        //in the second one, another user is sender and i am the reciecer
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getUsersForSidebar controller ", error.message);
    req.status(500).json({ message: "Server error" });
  }
};

//send messages controller
export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    //if the sender send a image
    let imageUrl;

    if (image) {
      //Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    //create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //realtime functionality goes here => socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessages controller ", error);
    res.status(500).json({ message: "Server error" });
  }
};
