import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connection success !! DB HOST: ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`);
        process.exit(1)
    }
}


export default connectDB   