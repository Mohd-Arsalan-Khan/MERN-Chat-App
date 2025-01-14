import express from "express"
import cookieParser from "cookie-parser"
import {notFound, errorHandler} from "./middlewares/error.middleware.js"


const app = express()

app.use(express.json())
app.use(cookieParser())

import userRouter from "./routes/user.route.js"

app.use("/api/v1/register", userRouter)


app.use(notFound)
app.use(errorHandler)

export {app}