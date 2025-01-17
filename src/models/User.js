import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : Number
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isSuperAdmin: { 
        type: Boolean, 
        default: false 
    }
})


UserSchema.pre("save",async function(next){
    if(!this.isModified('password')){
        return next();
    }

    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password,salt)
    next();
})


export default mongoose.model("User",UserSchema);