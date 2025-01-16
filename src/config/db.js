import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log("connected to mongoDB ")
    } catch(error){
        console.log("failed to connect to mongoDB : ",error);
    }
}

export default connectDB;

