import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const verifyToken = async (req, res, next) => {

    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access denied , no token is provided!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        
        const user = await User.findById(req.userId);
        if (!user.isSuperAdmin) {
            return res.status(403).json({ error: 'Access forbidden, you are not a superadmin' });
        }

        next();
    } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    }
 };

 export default verifyToken