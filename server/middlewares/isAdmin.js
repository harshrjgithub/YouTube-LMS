import { User } from '../models/user.model.js';

/**
 * Middleware to check if the authenticated user has admin/instructor privileges
 * This middleware should be used after isAuthenticated middleware
 */
const isAdmin = async (req, res, next) => {
    try {
        // Check if user is authenticated (should be set by isAuthenticated middleware)
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        // STRICT: Only allow admin role (exclusive admin access)
        if (req.user.role !== 'admin') {
            console.warn(`🚫 Access denied for user ${req.user.email} (${req.user.role}) to admin endpoint`);
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Administrator privileges required.' 
            });
        }

        // Additional security: Verify admin email matches the exclusive admin
        if (req.user.email !== 'adminlms@gmail.com') {
            console.error(`🚨 Security Alert: Non-admin email ${req.user.email} has admin role!`);
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Invalid administrator account.' 
            });
        }

        console.log(`✅ Admin access granted to ${req.user.email}`);
        // User has valid admin privileges, proceed to next middleware
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during authorization check' 
        });
    }
};

export default isAdmin;