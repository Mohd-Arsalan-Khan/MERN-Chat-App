import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import expressAsyncHandler from "express-async-handler"


export const verifyJWT = expressAsyncHandler(async(req,res,next) =>{
    try{
        const token = req.cookies?.Token || req.header("Authorization")?.replace("Bearer ","")
        if (!token) {
            throw new Error(401, "unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -jwt_token")
        if (!user) {
            throw new Error(401,"invalid user")
        }
       req.user = user
        next()
    }catch{
        throw new Error(401, "invalid token")
    }
})