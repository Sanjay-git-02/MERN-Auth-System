import mongoose from "mongoose";

const connectDatabase = async()=>{
    try {
        mongoose.connection.on('connected',()=>console.log("Database Connected"))
        await mongoose.connect(`${process.env.DB_URL}/mern-auth`)
    } catch (error) {
        console.error(error.message)
    }
    
}

export default connectDatabase;