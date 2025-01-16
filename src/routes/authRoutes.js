import express from 'express';
import User from '../models/user.js';

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


export default router;