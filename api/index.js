import mongoose from 'mongoose'
import {app} from './app.js'
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { Server } from 'socket.io'


dotenv.config()

connectDB()

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, console.log(`server is running on port ${PORT}`))

const io = new Server(server, {
    pingTimeout: 60000,
    cors:{
        origin: ["http://localhost:5173", "https://mern-chat-app-ijx7.onrender.com"],
        methods: ["GET", "POST"],  
        credentials: true
    }
})

io.on("connection", (socket) =>{
    console.log("connected to socket.io")

    socket.on("setup", (userData) =>{
        socket.join(userData._id)
        socket.emit("connected")
    })
    
    socket.on("join chat", (room) =>{
        socket.join(room)
        console.log("user joined room :" + room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))


    socket.on("new message", (newMessageRec) =>{
        const chat = newMessageRec.chat;

        if (!chat.users) {
            return console.log("chat.users is not defiend")
        }

        chat.users.forEach((user) =>{
            if (user._id == newMessageRec.sender._id) {
                return
            }
            socket.in(user._id).emit("message recieved", newMessageRec)
        })
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    socket.off("setup", () => {
        console.log(`Client disconnected`);
        socket.leave(userData._id)
      });
})


