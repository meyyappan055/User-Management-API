import express from 'express';
import User from '../models/user.js';
import bcrypt from "bcryptjs";
import verifyToken from '../middlewares/auth.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();


router.post('/api/register', async (req, res) => {
    const { name, email, password , phoneNumber } = req.body;

    const isValidEmail = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password) => {
        if (password.length >= 8) {
            return true;
        }
    }

    const isValidPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length === 10) {
            return true;
        }
    };

    if (isValidEmail(email)){

        if(!isValidPassword(password)){
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        if(!isValidPhoneNumber(phoneNumber)){
            return res.status(400).json({ message: 'Phone number must be 10 digits long' });
        }
        try {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }
    
            const newUser = new User({ name, email, password , phoneNumber });
            await newUser.save();
            res.status(201).json({ message: 'User saved successfully' });
    
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else{
        res.status(400).json({ message: 'Invalid email format' });
    }
    
});


router.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        
        if (!user.isActive) {
            return res.status(400).json({ message: "User is deactivated" });
        }

        const passCorrect = await bcrypt.compare(password, user.password);
        if (!passCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ 
            userId: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/api/user",verifyToken, async (req,res)=>{
    const email = req.query; // get user details through email

    try {
        const superAdmin = await User.findOne({ isSuperAdmin: true });
        if (!superAdmin) {
            return res.status(400).json({ message: "You are not authorized to view this data" });
        }

        const user = await User.find(email).select('-password'); //exclude password
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch(error){
        console.log("error : ", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


router.patch("/api/user",async (req,res) => {
    const {email , name, phoneNumber} = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { name, phoneNumber }, 
            { new: true } 
        ).select('name email phoneNumber'); 

        res.status(200).json({
            message: "User details updated successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})


router.patch("/api/user/deactivate", async (req, res) => {
    const { email } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { isActive: false },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Deactivated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error deactivating user:", error); 
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


router.patch("/api/user/:id", async (req, res) => {
    const id = req.params.id;
    const { name, phoneNumber } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, phoneNumber },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User details updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
