import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Correctly gets { userId: '...' }
        req.user = await User.findById(decoded.userId); // use 'userId', not 'id'
        
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user.password = undefined;
        req.id = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default isAuthenticated;