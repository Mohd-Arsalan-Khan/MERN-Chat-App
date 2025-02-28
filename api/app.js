import express from "express"
import cookieParser from "cookie-parser"
import {notFound, errorHandler} from "./middlewares/error.middleware.js"


const app = express()

app.use(express.json())


import userRouter from "./routes/user.route.js"
import chatRouter from "./routes/chat.route.js"
import messageRouter from "./routes/message.route.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/message", messageRouter)


app.use(notFound)
app.use(errorHandler)

export {app}