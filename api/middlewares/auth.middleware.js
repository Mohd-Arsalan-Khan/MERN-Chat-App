import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import expressAsyncHandler from "express-async-handler"


export const verifyJWT = expressAsyncHandler(async(req,res,next) =>{
    try {
        const token = req.cookies?.Token || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized request, no token provided" });
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -jwt_token");

        if (!user) {
            return res.status(401).json({ message: "Invalid user, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: "Invalid token or session expired" });
    }
});