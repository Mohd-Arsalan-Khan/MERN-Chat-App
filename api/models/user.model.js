import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: [true, 'password required']
    },
    picture:{
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},{timestamps: true})

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next()

    this.password = bcryptjs.hashSync(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcryptjs.compare(password, this.password)
}


userSchema.methods.generateJwtToken = function(){
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXP
    })
}


export const User = mongoose.model("User", userSchema)