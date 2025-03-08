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
    pintTimeout: 60000,
    cors:{
        origin: "http://localhost:5173",
    }
})

io.on("connection", (socket) =>{
    console.log("connected to socket.io")

    socket.on("disconnect", () => {
        console.log(`Client disconnected`);
      });
})


