import express from 'express';
import User from '../models/user.js';
import bcrypt from "bcryptjs";

const router = express.Router();


router.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ name, email, password });
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
    const email = req.body; // get user details through email

    try {
        const user = await User.findOne(email).select('name email')
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        res.send(user);
        res.status(201).json({ message: 'User saved successfully' });

    } catch(error){
        console.log("error : ", error)
    }
})
