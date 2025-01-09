import expressAsyncHandler from "express-async-handler"
import { User } from "../models/user.model.js"

const registerUser = expressAsyncHandler(async(req, res) =>{
    const {name, email, password, picture} = req.body

    if (!name || !email || !password) {
        throw new Error(400, "All field are required")
    }

    const userExist = await User.findOne({email})

    if (userExist) {
        throw new Error(404, "User already exsist")
    }

    const newUser = await User.create({
        name,
        email,
        password,
        picture
    })

    if (!newUser) {
        throw new Error(400, "Something went wrong try again")
    }

    res.status(200).json({newUser})
})

const loginUser = expressAsyncHandler(async() =>{
    
})

export{
    registerUser,
    loginUser
}