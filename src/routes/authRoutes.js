import express from 'express';
import User from '../models/user.js';
import bcrypt from "bcryptjs";

const router = express.Router();


router.post('/api/register', async (req, res) => {
    const { name, email, password , phoneNumber } = req.body;

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

        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;


router.get("/api/user", async (req,res)=>{
    const email = req.query; // get user details through email

    try {
        const user = await User.findOne(email).select('name email phoneNumber isActive');
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
