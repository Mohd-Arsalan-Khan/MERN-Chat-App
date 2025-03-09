import express from "express"
import cookieParser from "cookie-parser"
import {notFound, errorHandler} from "./middlewares/error.middleware.js"
import path from "path"

const __dirname = path.resolve()

const app = express()

app.use(express.json())


import userRouter from "./routes/user.route.js"
import chatRouter from "./routes/chat.route.js"
import messageRouter from "./routes/message.route.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/message", messageRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use(notFound)
app.use(errorHandler)

export {app}