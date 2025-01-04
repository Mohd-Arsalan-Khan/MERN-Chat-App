import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    content:{
        type: String,
        trim : true,
    },
    chat:{
        type: mongoose.Types.ObjectId,
        ref: "Chat"
    }
},{timestamps: true})

export const Message = mongoose.model("Message",messageSchema)