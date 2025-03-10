import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import messageModel from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUser = await User.find({_id: {$ne:loggedInUser}}).select("-password")
        res.status(200).json(filteredUser);

    } catch (error) {
        console.error("error getUsersForSideBar", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getMessage = async (req, res) => {
    try {
        const { id:userChatId } = req.params;
        const myId = req.user._id;

        const message = await messageModel.find({
            $or:[
                {senderId: myId, receiverId: userChatId},
                {senderId: userChatId, receiverId: myId}
            ]
        });

        res.status(200).json(message);
        
    } catch (error) {
        console.error("error getMessage", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text , image } = req.body;
        const { id:receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new messageModel({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("error sendMessage", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}