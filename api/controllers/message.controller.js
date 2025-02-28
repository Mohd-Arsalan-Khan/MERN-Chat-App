import expressAsyncHandler from "express-async-handler"
import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";


const sendMessage = expressAsyncHandler(async(req,res) =>{
    const {content, chatId} = req.body

    if (!content || !chatId) {
        return res.status(400).json({ error: "invalid data" });
    }
    
    try {
        var message = await Message.create({
            sender: req.user._id,
            content: content,
            chat: chatId
        })

        message = await message.populate("sender", "name picture"),
        message = await message.populate("chat")

        message = await User.populate(message,{
            path: "chat.users",
            select: "name picture email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage: message,
        })

        return res.status(200).json(message)
    } catch (error) {
        return res.status(400).json("error")
    }
})

const allMessages = expressAsyncHandler(async(req,res)=>{
    try {
        const getMessages = await Message.find({chat: req.params.chatId})
        .populate("sender","name picture email")
        .populate("chat")

        return res.status(200).json(getMessages)
    } catch (error) {
        return res.status(400).json(error.message)
    }
})

export{
    sendMessage,
    allMessages
}