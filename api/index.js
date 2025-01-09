import mongoose from 'mongoose'
import {app} from './app.js'
import dotenv from 'dotenv'
import connectDB from './db/index.js'


dotenv.config()

connectDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`server is running on port ${PORT}`))