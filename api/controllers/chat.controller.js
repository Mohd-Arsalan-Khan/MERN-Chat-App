import expressAsyncHandler from "express-async-handler"
import {Chat} from "../models/chat.model.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"

const accessChat = expressAsyncHandler(async(req,res) =>{
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId not found" });
    }
      let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");

      isChat = await User.populate(isChat, {
          path: "latestMessage.sender",
          select: "name picture email",
        });  
  
      if (isChat.length > 0) {
        return res.status(200).json(isChat[0]);
      }else{
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id , userId],
      }}

      try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }

    })

const fetchChat = expressAsyncHandler(async(req,res)=>{
  try {
    Chat.find({users:{$elemMatch:{$eq: req.user._id}}})
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({updatedAt: -1})
    .then(async (allChats)=>{
      allChats = await User.populate(allChats,{
        path: "latestMessage.sender",
        select: "name picture email"
      })
      res.status(200).json(allChats)
    })
    
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

const createGroupChat = expressAsyncHandler(async(req, res) =>{
  if (!req.body.name || !req.body.users) {
    throw new Error("all fields are required")
  }

  let users = JSON.parse(req.body.users)

  if (users.length < 2) {
    return res.status(400).json("more than 2 users are required to create a group chat")
  }

  users.push(req.user)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user
    })

    const fullGroupChat = await Chat.findOne({_id: groupChat._id})
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    res.status(200).json(fullGroupChat)
  } catch (error) {
    res.status(400).json(error.message)
  }

})

const renameGroup = expressAsyncHandler(async(req,res) =>{
  const {chatId, chatName} = req.body

  const updateName = await Chat.findByIdAndUpdate(chatId,{
    chatName
  },{
    new: true
  }).populate("users","-password")
  .populate("groupAdmin","-password")

  if (!chatName) {
    res.status(400);
    throw new Error("chat name not found")
  }else{
    res.status(200).json(updateName)
  }
})

const addToGroup = expressAsyncHandler(async(req,res) =>{
  const {chatId, userId} = req.body

  const added = await Chat.findByIdAndUpdate(chatId,{
    $push:{users: userId},
  }, 
  {new: true}).populate("users","-password")
  .populate("groupAdmin","-password")

  if (!added) {
    res.status(400);
    throw new Error("no user found")
  }else{
    res.status(200).json(added)
  }
})

const removeFromGroup = expressAsyncHandler(async(req,res)=>{
  const {chatId, userId} = req.body

  const removed = await Chat.findByIdAndUpdate(chatId,{
    $pull:{users: userId},
  },{new: true}).populate("users","-password")
  .populate("groupAdmin","-password")

  if (!removed) {
    res.status(400);
    throw new Error("no user found")
  }else{
    res.status(200).json(removed)
  }
})

  
export{
    accessChat,
    fetchChat,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
}