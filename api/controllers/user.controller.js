import expressAsyncHandler from "express-async-handler"
import { User } from "../models/user.model.js"

const generateToken = async(newUserId) =>{
    try {
        const user = await User.findById(newUserId)
        const Token = user.generateJwtToken()

        await user.save({validateBeforeSave: false})
        return{Token}
    } catch (error) {
        console.log(error)
    }
}

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
        picture,
    })

    const {Token} = await generateToken(newUser._id)

    const {password: pass, ...rest} = newUser._doc;

    const options ={
        httpOnly: true,
    }

    if (!newUser) {
        throw new Error(400, "Something went wrong try again")
    }

    res.status(200).cookie("access_token", Token, options).json(rest)
})

const loginUser = expressAsyncHandler(async(req, res) =>{
    const {email, password} = req.body

    if (!email || !password) {
        throw new Error(400, "All field are required")
    }

    const user = await User.findOne({$or:[{email},{password}]})

    if (!user) {
        throw new Error(404,"user not found")
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new Error(404, "password is incorrect")
    }

    const {Token} = await generateToken(user._id)

    const {password: pass, ...rest} = user._doc;

    const options ={
        httpOnly: true,
    }

    res.status(200).cookie("access_token", Token, options).json(rest)
    

})

export{
    registerUser,
    loginUser
}